import { gql } from '@apollo/client'
import { getApolloClient } from '../../graphql/apolloClient'
import {
  CreateListeningSession,
  CreateListeningSessionVariables,
  DeleteListeningSession,
  DeleteListeningSessionVariables,
  JoinListeningSession,
  JoinListeningSessionVariables,
  JoinSessionInfo,
} from '../../graphql/query.gen'

// For creating new listening sessions
const deleteListeningSessionMutation = gql`
  mutation DeleteListeningSession($sessionId: Int!) {
    deleteListeningSession(sessionId: $sessionId)
  }
`

export function deleteListeningSession(sessionId: number) {
  return getApolloClient().mutate<DeleteListeningSession, DeleteListeningSessionVariables>({
    mutation: deleteListeningSessionMutation,
    variables: { sessionId },
  })
}

// For creating new listening sessions
const createListeningSessionMutation = gql`
  mutation CreateListeningSession($partyRockerId: Int!) {
    createListeningSession(partyRockerId: $partyRockerId) {
      id
      timeCreated
    }
  }
`

export function createListeningSession(partyRockerId: number) {
  return getApolloClient().mutate<CreateListeningSession, CreateListeningSessionVariables>({
    mutation: createListeningSessionMutation,
    variables: { partyRockerId },
  })
}

// For adding to an existing session
const joinListeningSessionMutation = gql`
  mutation JoinListeningSession($input: JoinSessionInfo!) {
    joinListeningSession(input: $input)
  }
`
export function joinListeningSession(input: JoinSessionInfo) {
  return getApolloClient().mutate<JoinListeningSession, JoinListeningSessionVariables>({
    mutation: joinListeningSessionMutation,
    variables: { input },
  })
}
