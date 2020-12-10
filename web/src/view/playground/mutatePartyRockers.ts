import { gql } from '@apollo/client'
import { getApolloClient } from '../../graphql/apolloClient'
import { CreatePartyRocker, CreatePartyRockerVariables, PartyRockerInfo } from '../../graphql/query.gen'

// const answerSurveyQuestionMutation = gql`
//   mutation AnswerSurveyQuestion($input: SurveyInput!) {
//     answerSurvey(input: $input)
//   }
// `r

const createPartyRockerMutation = gql`
  mutation CreatePartyRocker($input: PartyRockerInfo!) {
    createPartyRocker(input: $input) {
      id
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

export function createPartyRocker(input: PartyRockerInfo) {
  return getApolloClient().mutate<CreatePartyRocker, CreatePartyRockerVariables>({
    mutation: createPartyRockerMutation,
    variables: { input },
  })
}
