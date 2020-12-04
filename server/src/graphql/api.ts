import DataLoader from 'dataloader'
import { readFileSync } from 'fs'
import { PubSub } from 'graphql-yoga'
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


export const pubsub = new PubSub()

export function getSchema() {
  const schema = readFileSync(path.join(__dirname, 'schema.graphql'))
  return schema.toString()
}

interface Context {
  user: User | null
  request: Request
  response: Response
  pubsub: PubSub
  //partyRockerLoader: DataLoader<number, PartyRocker>
  listeningSessionLoader: DataLoader<number, ListeningSession>
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
    createPartyRocker: async (_, { input }, ctx) => {
      const { name } = input

      const partyRocker = new PartyRocker()
      partyRocker.name = name
      await partyRocker.save()

      return partyRocker
    },
    createListeningSession: async (_, { partyRockerId }, ctx) => {

      const owner = check(await PartyRocker.findOne({ where: { id: partyRockerId }, relations: ['listeningSession']}))
//       console.log(owner)

      const listeningSession = new ListeningSession()

      listeningSession.owner = owner
      listeningSession.timeCreated = Math.round(Date.now() / 1000)
      listeningSession.queueLength = 0
      listeningSession.partyRockers = []
      listeningSession.partyRockers.push(owner)
      listeningSession.queue = []



      await listeningSession.save()


      owner.listeningSession = listeningSession
      await owner.save()


      return listeningSession
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
  Subscription: {
    surveyUpdates: {
      subscribe: (_, { surveyId }, context) => context.pubsub.asyncIterator('SURVEY_UPDATE_' + surveyId),
      resolve: (payload: any) => payload,
    },
  },

  /*ListeningSession: {
    partyRockers: (self, arg, ctx) => {
      return PartyRocker.find({ where: { listeningSession: self } })
    },
    queue: (self, arg, ctx) => {
      return Queue.find({ where: {listeningSession: self } })
    },
  },

  Artist: {
    songs: (self, arg, ctx) => {
      return Song.find({ where: { artist: self } })
    },
  },*/

}
