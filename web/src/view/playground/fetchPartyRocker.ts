import { gql } from '@apollo/client'

// export const fragmentSurvey = gql`
//   fragment Survey on Survey {
//     id
//     name
//     isStarted
//     isCompleted
//     currentQuestion {
//       ...SurveyQuestion
//     }
//   }
// `

export const fragmentPartyRocker = gql`
  fragment PartyRocker on PartyRocker {
    id
    name
    spotifyCreds
    listeningSession {
      id
    }
  }
`

export const fetchPartyRocker = gql`
  query FetchPartyRocker {
    partyRockers {
      ...PartyRocker
    }
  }
  ${fragmentPartyRocker}
`
