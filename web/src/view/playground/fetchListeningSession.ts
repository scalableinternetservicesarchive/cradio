import { gql } from '@apollo/client'
import { fragmentPartyRocker } from './fetchPartyRocker'
import { fragmentQueue } from './fetchQueue'

export const fragmentListeningSession = gql`
  fragment ListeningSession on ListeningSession {
    id
    timeCreated
    owner
    {
      ...PartyRocker
    }
    partyRockers {
      ...PartyRocker
    }
    queue {
      ...Queue
    }
  }
`


export const fetchListeningSession = gql`
  query FetchListeningSession($sessionId: Int!) {
    listeningSession(sessionId: $sessionId ) {
      ...ListeningSession
    }
  }
  ${fragmentListeningSession}
  ${fragmentPartyRocker}
  ${fragmentQueue}
`

// export const subscribeSurveys = gql`
//   subscription SurveySubscription($surveyId: Int!) {
//     surveyUpdates(surveyId: $surveyId) {
//       ...Survey
//     }
//   }
//   ${fragmentSurvey}
//   ${fragmentSurveyQuestion}
//`

// export const fragmentSurveyQuestion = gql`
//   fragment SurveyQuestion on SurveyQuestion {
//     id
//     prompt
//     choices
//     answers {
//       answer
//     }
//   }
// `

// export const fetchSurvey = gql`
//   query FetchSurvey($surveyId: Int!) {
//     survey(surveyId: $surveyId) {
//       ...Survey
//     }
//   }
//   ${fragmentSurvey}
//   ${fragmentSurveyQuestion}
// `
