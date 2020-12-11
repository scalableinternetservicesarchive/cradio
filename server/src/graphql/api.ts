import { readFileSync } from 'fs'
import { PubSub } from 'graphql-yoga'
import Redis from 'ioredis'
import path from 'path'
//import { getManager } from 'typeorm'
import { check } from '../../../common/src/util'
import { Song } from '../entities/Song'
import { Survey } from '../entities/Survey'
import { SurveyAnswer } from '../entities/SurveyAnswer'
import { SurveyQuestion } from '../entities/SurveyQuestion'
import { User } from '../entities/User'
import { Resolvers } from './schema.types'


//Redis "Schema":

//entity for each indicivual queue item  (ID here is a unique id for the queue item)
// queueItem:<ID> {  }

//entity for each listening session (key)
// listeningSession:<listeningSessionId> {….}

//Entity for each queue (a set of queue ids) the key includes the listening session id
// listeningSession:<listeningSessionId>:queue set([id1, id2, …. ])

 //entity for each indicivual party rocker  (ID here is a unique id for the queue item)
// partyRocker:<ID> {  }

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
    listeningSession: async (_, { sessionId }, {redis}) => { const result = await redis.hgetall(`listeningSession:${sessionId}`)
    console.log("query result:", result)
  return result as any || null},
    sessionQueue: async (_, { sessionId }, {redis}) => {
    const queueItemIds = await redis.smembers(`listeningSession:${sessionId}:queue`) //Get the Ids (keys) of the items you wanna fetch
    const promises = queueItemIds.map(async (item, index) =>  redis.hgetall(`queueItem:${item}`))
    const queueItems = await Promise.all(promises)
    console.log("queue items result", queueItems)
    return queueItems as any || null }, //do we want this null???
    surveys: () => Survey.find(),
    //partyRockers: async () => await PartyRocker.find(), //does anyone use this??
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
    addToQueue: async (_, { input }, {redis, pubsub}) => {
      const { songId, listeningSessionId } = input
      const song = check(await Song.findOne({ where: { id: songId }, relations: ['artist'] }))
      console.log("adding song to queue: ", song)
    //   const listeningSession = check(await ListeningSession.findOne({ where: { id: listeningSessionId }, relations: ['queue', 'queue.song']}))

    //   const queueItem = new Queue()
    //   queueItem.score = 0
    //   queueItem.position = listeningSession.queueLength + 1 //assuming increment succeeds
    //   queueItem.song = song
    //  // console.log("listening session: ",listeningSession)
    //   queueItem.listeningSession = listeningSession
    //   //console.log("Queue Item", queueItem)
    //   check(await queueItem.save())

    // //adding the queue item to the listneing session
    // //   console.log("listening session queue", listeningSession.queue)
    // //  listeningSession.queue.push(queueItem)
    // //  check(await listeningSession.save())

    // //check this below, is this creating a race condition???
    // //  incrementing length of listeningSession.queueLength
    //  const entityManager = getManager();
    //  // change this to saving the entity above???
    //  check(await entityManager.increment(ListeningSession, { id: listeningSessionId }, "queueLength", 1))

////////////////////////////////////////////////////////////////////////////////////////
/////////////////// SUBSCRIPTION BLOCK -- CONVERTION TO REDIS NEEDED ///////////////////
////////////////////////////////////////////////////////////////////////////////////////
      // const listeningSession = check(
      //   await ListeningSession.findOne({ where: { id: listeningSessionId }, relations: ['queue', 'queue.song'] })
      // )
      // const queueItem = new Queue()
      // queueItem.score = 0
      // queueItem.position = listeningSession.queueLength + 1 //assuming increment succeeds
      // queueItem.song = song
      // queueItem.listeningSession = listeningSession
      // listeningSession.queue.push(queueItem)
      // check(await listeningSession.save())
      // const entityManager = getManager()
      // check(await entityManager.increment(ListeningSession, { id: listeningSessionId }, 'queueLength', 1))

////////////////////////////////////////////////////////////////////////////////////////
/////////////////// SUBSCRIPTION BLOCK -- CONVERTION TO REDIS NEEDED ///////////////////
////////////////////////////////////////////////////////////////////////////////////////



     //REDIS WAY

     //Make sure listening session exists
     const listeningSessionQueueLength = await redis.hmget(`listeningSession:${listeningSessionId}`, "queueLength") //error check here if session doesnt exist??
     console.log("queue length", listeningSessionQueueLength)
     if (listeningSessionQueueLength[0] == null){
       return false
     }
     const queueLength = Number(listeningSessionQueueLength[0])

     const numQueueItems= await redis.incr("numQueueItems") //Incrementer to use for a unique id, race conditions???
     const queueItem = {id: numQueueItems, score: 0, position: queueLength + 1, songId: songId };
     const response = await redis.hmset(`queueItem:${numQueueItems}`, queueItem) //should i store for song and listening session here??

     if (response != "OK"){
       return false
     }

     const numIdsAdded = await redis.sadd(`listeningSession:${listeningSessionId}:queue`, numQueueItems)
     if (numIdsAdded == 0){
      return false
    }

    const updateQueueLenResult = await redis.hincrby(`listeningSession:${listeningSessionId}`, "queueLength", 1)
    if (updateQueueLenResult == queueLength){
      return false
    }

    pubsub.publish('QUEUE_UPDATE' + listeningSessionId, queueItem)
      return true
    },
    createPartyRocker: async (_, { input }, {redis}) => {
      const { name } = input

      const numPartyRockers = await redis.incr("numPartyRockers")
      const response = await redis.hmset(`partyRocker:${numPartyRockers}`, "id", numPartyRockers, "name", name) //should i store empty strings here??
      console.log("hmset response create party rocker", response)
      let partyRocker = {id: numPartyRockers, name: name, spotifyCreds: ""} //add listnein session here??

      // const partyRocker = new PartyRocker()
      // partyRocker.name = name
      // await partyRocker.save()

      return partyRocker
    },
    createListeningSession: async (_, { partyRockerId }, {redis}) => {
      //const owner = check(await PartyRocker.findOne({ where: { id: partyRockerId }, relations: ['listeningSession']}))
//       console.log(owner)


      const partyRockerOwner = await redis.hmget(`partyRocker:${partyRockerId}`, "id")
      console.log("owner id from redis", partyRockerOwner)
      //let ownerId:Number;
      if (partyRockerOwner === undefined || partyRockerOwner[0] == null) {
        // array empty or does not exist
          console.log("party rocker does not exist, need an owner for the session")
          throw new Error("Party Rocker with that ID does not exist")
          //add error check here!
      }
      const ownerId = Number(partyRockerOwner[0]);
      const secondsSinceEpoch = Math.round(Date.now() / 1000)
      const numListeningSessions = await redis.incr("numListeningSessions")

      const listeningSession = {id: numListeningSessions, timeCreated: secondsSinceEpoch, queueLength: 0, owner: ownerId}

      const listeningSessionRedis = await redis.hmset(`listeningSession:${numListeningSessions}`, listeningSession)
      console.log("session creation result", listeningSessionRedis)
      // const listeningSessionResult = await redis.hgetall(`listeningSession:${numListeningSessions}`)
      // console.log("creation result", listeningSessionResult)

      const numIdsAdded = await redis.sadd(`listeningSession:${numListeningSessions}:partyRockers`, ownerId)
      if (numIdsAdded == 0){
        throw new Error("Error Adding Owner to list of rockers in listening session")
      }

      //OLD CODE WHEN USING SQL TYPE ORM
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
    deleteListeningSession: async (_, { sessionId }, {redis}) => {


      // const entityManager = getManager();
      // check(await entityManager.delete(ListeningSession, { id: sessionId }))

      const queueItemIds = await redis.smembers(`listeningSession:${sessionId}:queue`)
      queueItemIds.forEach(async queueItemId => { const queueItemDelete = await redis.del(`queueItem:${queueItemId}`)
         console.log("queue item delete result: ", queueItemDelete)}
        )

      const deleteQueueResult = await redis.del(`listeningSession:${sessionId}:queue`)
      console.log("number of keys removed ", deleteQueueResult)

      const partyRockerIds = await redis.smembers(`listeningSession:${sessionId}:partyRockers`)
      partyRockerIds.forEach(async partyRockerId => { const partyRockerDelete = await redis.del(`partyRocker:${partyRockerId}`)
         console.log("partyRocker delete result: ", partyRockerDelete)}
        )

      const deletePartyRockers = await redis.del(`listeningSession:${sessionId}:partyRockers`)
      console.log("number of keys removed (party Rockers) ", deletePartyRockers)

      const deleteSessionResult = await redis.del(`listeningSession:${sessionId}`)
      if (deleteSessionResult <=0 ){
       return false
      }

      return true
    },
    joinListeningSession: async (_, { input }, {redis}) => {
      const { partyRockerId, sessionId } = input
      // const partyRocker = check(await PartyRocker.findOne({ where: { id: partyRockerId }, relations: ['listeningSession']}))
      // const listeningSession = check(await ListeningSession.findOne({ where: { id: sessionId }, relations: ['partyRockers']}))

      // listeningSession.partyRockers.push(partyRocker)

      // await listeningSession.save()
      // partyRocker.listeningSession = listeningSession
      // await partyRocker.save()


      const rockerExists = await redis.exists(`partyRocker:${partyRockerId}`)
      if (rockerExists == 0){
        return false
      }

      //Add listening session relationship here for the party rocker entity

      const sessionExists = await redis.exists(`listeningSession:${sessionId}`)
      if (sessionExists == 0){
        return false
      }

      const numIdsAdded = await redis.sadd(`listeningSession:${sessionId}:partyRockers`, partyRockerId)
      if (numIdsAdded == 0){
        return false
      }

      return true
    },
  },
  ListeningSession: {
    async queue(parent, args, {redis})  {
      const queueItemIds = await redis.smembers(`listeningSession:${parent.id}:queue`) //Get the Ids (keys) of the items you wanna fetch
      // const result: any[] = []
      // //for each Id fetch the item from redis and push the retrieved item into the result list
      // queueItemIds.forEach(async queueItemId => { const queueItem = await redis.hgetall(`queueItem:${queueItemId}`)
      //    result.push(queueItem)
      //    console.log("queue item searh result: ", queueItem)}
      //   )


      const promises = queueItemIds.map(async (item, index) =>  redis.hgetall(`queueItem:${item}`))
      const queueItems = await Promise.all(promises)
      console.log("queue items result", queueItems)

      return queueItems as any

    },
    async partyRockers(parent, args, {redis})  {
      const partyRockerIds = await redis.smembers(`listeningSession:${parent.id}:partyRockers`)
      // let result: any[] = [] //what to do about this???
      // partyRockerIds.forEach(async partyRockerId => { const partyRocker = await redis.hgetall(`partyRocker:${partyRockerId}`)
      // console.log("party rocker to add to list: ", partyRocker)
      //   result.push(partyRocker)})


        const promises = partyRockerIds.map(async (item, index) =>  redis.hgetall(`partyRocker:${item}`))
        const partyRockers = await Promise.all(promises)
        console.log("party rockers result", partyRockers)
      return partyRockers as any

    },
    async owner(parent, args, {redis})  {
      const owner = await redis.hgetall(`partyRocker:${parent.owner}`)
      return owner as any
    }
  },
  Queue: {
    async song(parent, args, {redis})  {
      const songId = await redis.hget(`queueItem:${parent.id}`, "songId") //Maybe change this to speed up?
      const song = check(await Song.findOne({ where: { id: songId }, relations: ['artist'] }))
      return song
    }
  },
  Subscription: {
    queueUpdates: {
      subscribe: (_, { sessionId }, context) => context.pubsub.asyncIterator('QUEUE_UPDATE' + sessionId),
      resolve: (payload: any) => payload,
    },
    surveyUpdates: {
      subscribe: (_, { surveyId }, context) => context.pubsub.asyncIterator('SURVEY_UPDATE_' + surveyId),
      resolve: (payload: any) => payload,
    },
  },
}
