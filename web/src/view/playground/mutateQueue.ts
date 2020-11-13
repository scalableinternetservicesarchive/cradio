import { gql } from '@apollo/client'
import { getApolloClient } from '../../graphql/apolloClient'
import {
  AddToQueue,
  AddToQueueVariables,
  QueueInfo
} from '../../graphql/query.gen'

// const answerSurveyQuestionMutation = gql`
//   mutation AnswerSurveyQuestion($input: SurveyInput!) {
//     answerSurvey(input: $input)
//   }
// `

const addToQueueMutation = gql`
  mutation AddToQueue($input: QueueInfo!) {
    addToQueue(input: $input)
  }
`

// mutation { addToQueue(input:1){
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

export function addToQueue(input: QueueInfo) {
  return getApolloClient().mutate<AddToQueue, AddToQueueVariables>({
    mutation: addToQueueMutation,
    variables: { input },
  })
}
