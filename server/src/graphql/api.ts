import { readFileSync } from 'fs'
import { PubSub } from 'graphql-yoga'
import Redis from 'ioredis'
import path from 'path'
import { getManager } from 'typeorm'
//import { getManager } from 'typeorm'
import { check } from '../../../common/src/util'
import { ListeningSession } from '../entities/ListeningSession'
import { PartyRocker } from '../entities/PartyRocker'
import { Queue } from '../entities/Queue'
import { Song } from '../entities/Song'
import { Survey } from '../entities/Survey'
import { SurveyAnswer } from '../entities/SurveyAnswer'
import { SurveyQuestion } from '../entities/SurveyQuestion'
import { User } from '../entities/User'
import { Resolvers } from './schema.types'


//Redis "Schema":

//entity for each indicivual queue item  (ID here is a unique id for the queue item)
// queue:<ID> {  }

//entity for each listening session (key)
// listeningSession:<listeningSessionId> {….}

//Entity for each queue (a set of queue ids) the key includes the listening session id
// listeningSession:<listeningSessionId>:queue set([id1, id2, …. ])

 //entity for each indicivual party rocker  (ID here is a unique id for the queue item)
// Party rocker:<ID> {  }

 //Entity for each list of party rockers within a queue (a set of party rocke ids) the key includes the listening session id
// listeningSession:<listeningSessionId>:partyRockers set([id1, id2, …. ])

export const pubsub = new PubSub()
export const my_redis = new Redis()

export function getSchema() {
  const schema = readFileSync(path.join(__dirname, 'schema.graphql'))
  return schema.toString()
}

interface Context {
  user: User | null
  request: Request
  response: Response
  pubsub: PubSub
  redis: Redis.Redis
}

export const graphqlRoot: Resolvers<Context> = {
  Query: {
    self: (_, args, ctx) => ctx.user,
    survey: async (_, { surveyId }) => (await Survey.findOne({ where: { id: surveyId } })) || null,
    listeningSession: async (_, { sessionId }) => { const result = await ListeningSession.findOne({ where: { id: sessionId }, relations: ['owner', 'partyRockers'] })
    console.log("result", result)
  return result || null},
    sessionQueue: async (_, { sessionId }) => (await Queue.find({ where: { listeningSession:{id: sessionId} } , relations: ['song', 'listeningSession']})) || null, //do we want this null???
    surveys: () => Survey.find(),
    partyRockers: async () => await PartyRocker.find(),
    songs: async () => await Song.find({relations: ['artist']}),
    song: async (_, { songName }) => (await Song.find({ where: { name: songName }, relations: ['artist'] }))
  },
  Mutation: {
    answerSurvey: async (_, { input }, ctx) => {
      const { answer, questionId } = input
      const question = check(await SurveyQuestion.findOne({ where: { id: questionId }, relations: ['survey'] }))

      const surveyAnswer = new SurveyAnswer()
      surveyAnswer.question = question
      surveyAnswer.answer = answer
      await surveyAnswer.save()

      question.survey.currentQuestion?.answers.push(surveyAnswer)
      ctx.pubsub.publish('SURVEY_UPDATE_' + question.survey.id, question.survey)

      return true
    },
    nextSurveyQuestion: async (_, { surveyId }, ctx) => {
      // check(ctx.user?.userType === UserType.Admin)
      const survey = check(await Survey.findOne({ where: { id: surveyId } }))
      survey.currQuestion = survey.currQuestion == null ? 0 : survey.currQuestion + 1
      await survey.save()
      ctx.pubsub.publish('SURVEY_UPDATE_' + surveyId, survey)
      return survey
    },
    addToQueue: async (_, { input }, ctx) => {
      const { songId, listeningSessionId } = input
      const song = check(await Song.findOne({ where: { id: songId }, relations: ['artist'] }))
      const listeningSession = check(await ListeningSession.findOne({ where: { id: listeningSessionId }, relations: ['queue', 'queue.song']}))

      const queueItem = new Queue()
      queueItem.score = 0
      queueItem.position = listeningSession.queueLength + 1 //assuming increment succeeds
      queueItem.song = song
     // console.log("listening session: ",listeningSession)
      queueItem.listeningSession = listeningSession
      //console.log("Queue Item", queueItem)
      check(await queueItem.save())

    //adding the queue item to the listneing session
    //   console.log("listening session queue", listeningSession.queue)
    //  listeningSession.queue.push(queueItem)
    //  check(await listeningSession.save())

    //check this below, is this creating a race condition???
    //  incrementing length of listeningSession.queueLength
     const entityManager = getManager();
     // change this to saving the entity above???
     check(await entityManager.increment(ListeningSession, { id: listeningSessionId }, "queueLength", 1))


      return true
    },
    createPartyRocker: async (_, { input }, {redis}) => {
      const { name } = input

      const numPartyRockers = await redis.incr("numPartyRockers")
      const response = redis.hmset(`partyRocker:${numPartyRockers}`, "id", numPartyRockers, "name", name) //should i store empty strings here??
      console.log("hmset response", response)
      const partyRocker = new PartyRocker()
      partyRocker.name = name
      await partyRocker.save()

      return partyRocker
    },
    createListeningSession: async (_, { partyRockerId }, {redis}) => {
      //const owner = check(await PartyRocker.findOne({ where: { id: partyRockerId }, relations: ['listeningSession']}))
//       console.log(owner)


      const partyRockerOwner = await redis.hmget(`partyRocker:${partyRockerId}`, "id")
      console.log("owner id from redis", partyRockerOwner)
      //let ownerId:Number;
      if (partyRockerOwner === undefined || partyRockerOwner.length == 0) {
        // array empty or does not exist
          console.log("party rocker does not exist, need an owner for the session")
          //add error check here!
      }
      const ownerId = Number(partyRockerOwner[0]);
      const secondsSinceEpoch = Math.round(Date.now() / 1000)
      const numListeningSessions = await redis.incr("numListeningSessions")
      const listeningSessionRedis = await redis.hmset(`listeningSession:${numListeningSessions}`, "id", numListeningSessions, "timeCreated", secondsSinceEpoch, "owner", ownerId)
      console.log("session creation result", listeningSessionRedis)
      const listeningSessionResult = await redis.hgetall(`listeningSession:${numListeningSessions}`)
      console.log("creation result", listeningSessionResult)


      const listeningSession = {id: numListeningSessions, timeCreated: secondsSinceEpoch, queueLength: 0, owner: ownerId, partyRockers: [ownerId], queue: []} //do i need to return an empty list here for queue?? what about party rockers?? wont the resolvers handle this??


      // const listeningSession = new ListeningSession()
      // listeningSession.owner = owner
      // listeningSession.timeCreated = Math.round(Date.now() / 1000)
      // listeningSession.queueLength = 0
      // listeningSession.partyRockers = []
      // listeningSession.partyRockers.push(owner)
      // listeningSession.queue = []



      // await listeningSession.save()


      // owner.listeningSession = listeningSession
      // await owner.save()


      return listeningSession as any
      //return listeningSessionResult
    },
    deleteListeningSession: async (_, { sessionId }, ctx) => {


      const entityManager = getManager();
      check(await entityManager.delete(ListeningSession, { id: sessionId }))

      return true


    },
    joinListeningSession: async (_, { input }, ctx) => {
      const { partyRockerId, sessionId } = input
      const partyRocker = check(await PartyRocker.findOne({ where: { id: partyRockerId }, relations: ['listeningSession']}))
      const listeningSession = check(await ListeningSession.findOne({ where: { id: sessionId }, relations: ['partyRockers']}))

      listeningSession.partyRockers.push(partyRocker)

      await listeningSession.save()
      partyRocker.listeningSession = listeningSession
      await partyRocker.save()
      return true
    }
  },
  ListeningSession: {
    async queue(parent, args, {redis})  {
      const queueItemIds = await redis.smembers(`listeningSession:${parent.id}:queue`)
      let result: any[] = [] //what to do about this???
      queueItemIds.forEach(async queueItemId => { const queueItem = await redis.hgetall(`queueItem:${queueItemId}`)
        result.push(queueItem)})
      return result

    }
  },
  Subscription: {
    surveyUpdates: {
      subscribe: (_, { surveyId }, context) => context.pubsub.asyncIterator('SURVEY_UPDATE_' + surveyId),
      resolve: (payload: any) => payload,
    },
  }
}
