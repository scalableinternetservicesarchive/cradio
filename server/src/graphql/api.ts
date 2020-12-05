import DataLoader from 'dataloader'
import { readFileSync } from 'fs'
import { PubSub } from 'graphql-yoga'
import path from 'path'
import { getManager } from 'typeorm'
import { check } from '../../../common/src/util'
import { getSQLConnection } from '../db/sql'
import { Artist } from '../entities/Artist'
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
  partyRockerLoader: DataLoader<number, PartyRocker>
  listeningSessionLoader: DataLoader<number, ListeningSession>
  queueLoader: DataLoader<number, Queue>
  songLoader: DataLoader<number, Song>
  artistLoader: DataLoader<number, Artist>
}

export const graphqlRoot: Resolvers<Context> = {
  Query: {
    self: (_, args, ctx) => ctx.user,
    survey: async (_, { surveyId }) => (await Survey.findOne({ where: { id: surveyId } })) || null,
    listeningSession: async (_, { sessionId }) => { const result = await ListeningSession.findOne({ where: { id: sessionId }})
    //console.log("result", result)
  return result || null},
    sessionQueue: async (_, { sessionId }) => (await Queue.find({ where: { listeningSession:{id: sessionId} }})) || null, //do we want this null???
    surveys: () => Survey.find(),
    partyRockers: async () => await PartyRocker.find(),
    songs: async () => await Song.find(),
    song: async (_, { songName }) => (await Song.find({ where: { name: songName }}))
  },
  Mutation: {
    answerSurvey: async (_, { input }, ctx) => {
      const { answer, questionId } = input
      const question = check(await SurveyQuestion.findOne({ where: { id: questionId }}))

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
      const song = check(await Song.findOne({ where: { id: songId }}))
      const listeningSession = check(await ListeningSession.findOne({ where: { id: listeningSessionId }}))

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
    deletePartyRocker: async (_, { partyRockerId }, ctx) => {

      const entityManager = getManager();
      check(await entityManager.delete(PartyRocker, { id: partyRockerId }))

      return true

    },
    createListeningSession: async (_, { partyRockerId }, ctx) => {

      const owner = check(await PartyRocker.findOne({ where: { id: partyRockerId }}))
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
      const partyRocker = check(await PartyRocker.findOne({ where: { id: partyRockerId }}))
      const listeningSession = check(await ListeningSession.findOne({ where: { id: sessionId }}))

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

  ListeningSession: {
    partyRockers: async (self, arg, ctx) => {
      //return PartyRocker.find({ where: { listeningSession: self } })
      //let foundRockers = await PartyRocker.find({ where: { listeningSession: self } })
      //let foundRockers = await PartyRocker.find({ select: ["id"], where: { listeningSession: self } })
      //let rockerIdArr: Array<number> = []
      //foundRockers.forEach(fr => {
        //rockerIdArr.push(fr.id)
      //})
      const sql = await getSQLConnection()
      const RockersId = await sql.query(`SELECT id from party_rocker where listeningSessionId = ${self.id}`, [1])
      let arrRockers: Array<number> = []
      RockersId.forEach((r: any) => {
        arrRockers.push(r.id)
      })
      return ctx.partyRockerLoader.loadMany(arrRockers) as any
    },
    queue: async (self, arg, ctx) => {
      /*let foundQueues = await Queue.find({ where: { listeningSession: self } })
      let queueIdArr: Array<number> = []
      foundQueues.forEach(fr => {
        queueIdArr.push(fr.id)
      })*/
      //return Queue.find({ where: {listeningSession: self } })
      const sql = await getSQLConnection()
      const QueuesId = await sql.query(`SELECT id from queue where listeningSessionId = ${self.id}`, [1])
      let arrQueues: Array<number> = []
      QueuesId.forEach((q: any) => {
        arrQueues.push(q.id)
      })
      return ctx.partyRockerLoader.loadMany(arrQueues) as any
    },
    owner: async (self, arg, ctx) => {
      const sql = await getSQLConnection()
      const [OwnerId] = await sql.query(`SELECT ownerId from listening_session where id = ${self.id}`, [1])
      //const result = await PartyRocker.findOne({ where: { id: OwnerId.ownerId } })
      //return result as any
      return ctx.partyRockerLoader.load(OwnerId.ownerId) as any
    },
  },

  PartyRocker: {
    listeningSession: async (self, arg, ctx) => {
      //return ListeningSession.find({ where: { partyRockers: self } })
      //return ctx.partyRockerLoader.load((self as any)) as any
      const sql = await getSQLConnection()
      const [SessionId] = await sql.query(`SELECT listeningSessionId from party_rocker where id = ${self.id}`, [1])
      //const result = await ListeningSession.findOne({ where: { id: SessionId.listeningSessionId } })
      //return result as any
      return ctx.listeningSessionLoader.load(SessionId.listeningSessionId)
    },
  },

  Artist: {
    songs: async (self, arg, ctx) => {
      //return Song.find({ where: { artist: self } })
      /*let foundSongs = await Song.find({ where: { Artist: self } })
      let songIdArr: Array<number> = []
      foundSongs.forEach(fs => {
        songIdArr.push(fs.id)
      })*/
      const sql = await getSQLConnection()
      const SongsId = await sql.query(`SELECT id from songs where artistId = ${self.id}`, [1])
      let arrSongs: Array<number> = []
      SongsId.forEach((s: any) => {
        arrSongs.push(s.id)
      })
      return ctx.songLoader.loadMany(arrSongs) as any
    },
  },

  Song: {
    artist: async (self, arg, ctx) => {
      const sql = await getSQLConnection()
      const [ArtistId] = await sql.query(`SELECT artistId from song where id = ${self.id}`, [1])
      //const result = await Artist.findOne({ where: { id: ArtistId.artistId } })
      //return result as any
      return ctx.artistLoader.load(ArtistId.artistId) as any
    },
  },

  Queue: {
    song: async (self, arg, ctx) => {
      const sql = await getSQLConnection()
      const [SongId] = await sql.query(`SELECT songId from queue where id = ${self.id}`, [1])
      //const result = await Song.findOne({ where: { id: SongId.songId } })
      //return result as any
      return ctx.songLoader.load(SongId.songId) as any
    },
    listeningSession: async (self, arg, ctx) => {
      const sql = await getSQLConnection()
      const [SessionId] = await sql.query(`SELECT listeningSessionId from queue where id = ${self.id}`, [1])
      //const result = await ListeningSession.findOne({ where: { id: SessionId.listeningSessionId } })
      //return result as any
      return ctx.listeningSessionLoader.load(SessionId.listeningSessionId) as any
    },
  },

}
