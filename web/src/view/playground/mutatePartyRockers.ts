import { gql } from '@apollo/client'
import { getApolloClient } from '../../graphql/apolloClient'
import {
  CreatePartyRocker,
  CreatePartyRockerVariables,
  DeletePartyRocker,
  DeletePartyRockerVariables,
  PartyRockerInfo
} from '../../graphql/query.gen'

// For creating new party rockers
const createPartyRockerMutation = gql`
  mutation CreatePartyRocker($input: PartyRockerInfo!) {
    createPartyRocker(input: $input) {
      id
    }
  }
`

export function createPartyRocker(input: PartyRockerInfo) {
  return getApolloClient().mutate<CreatePartyRocker, CreatePartyRockerVariables>({
    mutation: createPartyRockerMutation,
    variables: { input },
  })
}

// For deleting party rocker
const deletePartyRockerMutation = gql`
  mutation DeletePartyRocker($partyRockerId: Int!) {
    deletePartyRocker(partyRockerId: $partyRockerId)
  }
`

export function deletePartyRocker(partyRockerId: number) {
  return getApolloClient().mutate<DeletePartyRocker, DeletePartyRockerVariables>({
    mutation: deletePartyRockerMutation,
    variables: { partyRockerId },
  })
}