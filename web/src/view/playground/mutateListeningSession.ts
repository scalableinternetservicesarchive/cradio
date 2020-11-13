import { gql } from '@apollo/client'
import { getApolloClient } from '../../graphql/apolloClient'
import {
  CreateListeningSession,
  CreateListeningSessionVariables
} from '../../graphql/query.gen'

// const answerSurveyQuestionMutation = gql`
//   mutation AnswerSurveyQuestion($input: SurveyInput!) {
//     answerSurvey(input: $input)
//   }
// `

const createListeningSessionMutation = gql`
  mutation CreateListeningSession($partyRockerId: Int!) {
    createListeningSession(partyRockerId: $partyRockerId) {
      id
      timeCreated

    }
  }
`

// mutation { createListeningSession(partyRockerId:1){
//   id
//   timeCreated
//   partyRockers{name}
// }}

//WHAT IS THE DIFFERENCE BETWEEN PASSING THE CLIENT LIKE THIS AND USING GETAPOLLOCLIENT() LIKE BELOW
// export function answerSurveyQuestion(client: ApolloClient<any>, input: SurveyInput) {
//   return client.mutate<AnswerSurveyQuestion, AnswerSurveyQuestionVariables>({
//     mutation: answerSurveyQuestionMutation,
//     variables: { input },
//   })
// }

export function createListeningSession(partyRockerId: number) {
  return getApolloClient().mutate<CreateListeningSession, CreateListeningSessionVariables>({
    mutation: createListeningSessionMutation,
    variables: { partyRockerId },
  })
}
