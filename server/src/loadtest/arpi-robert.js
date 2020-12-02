import http from 'k6/http'
import { sleep } from 'k6'
import { Counter, Rate } from 'k6/metrics'

const numOfVus = 5
const numOfIterations = 2
export const options = {
  scenarios: {
    manyUsers: {
      // name of the executor to use
      executor: 'per-vu-iterations',
      vus: numOfVus,
      iterations: numOfIterations,
      maxDuration: '0h2m',
    },
  },
}

const totalEntries = numOfVus * numOfIterations
const partyRockerCreation_Success = new Counter('PartyRocker_Creation_Success')
const listeningSessionCreation_Success = new Counter('ListeningSession_Creation_Success')
const addToQueue_Success = new Counter('AddToQueue_Creation_Success')

//let partyRockerIds = []
//let listeningSessionIds = []

export default function () {
  // recordRates(

  const nameGen = '{"operationName":"CreatePartyRocker","variables":{"input":{"name":"' + String(__VU) + '"}},"query":"mutation CreatePartyRocker($input: PartyRockerInfo!) { \\n createPartyRocker(input: $input) { \\n id }}"}'
  const mainPartyRocker = http.post(
    'http://localhost:3000/graphql',
    nameGen,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (mainPartyRocker.body.length === 0){
    console.log('No response body for party rocker creation received')
  }
  else if (mainPartyRocker.status >= 200 && mainPartyRocker.status < 300) {
    partyRockerCreation_Success.add(1)
    const partyRockerId = JSON.parse(mainPartyRocker.body).data.createPartyRocker.id
    //partyRockerIds.push(partyRockerId)
    //console.log(partyRockerIds.length)

    sleep(Math.random(3));

    const sessGen = '{"operationName":"CreateListeningSession","variables":{"partyRockerId":' + partyRockerId + '},"query":"mutation CreateListeningSession($partyRockerId: Int!) {\\n createListeningSession(partyRockerId: $partyRockerId) { \\n id timeCreated }}"}'
    const mainSession = http.post(
      'http://localhost:3000/graphql',
      sessGen,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    sleep(Math.random(3));

    if(mainSession.body.length == 0){
        console.log('No response body for session creation received')
    }
    else if (mainSession.status >= 200 && mainSession.status < 300) {
      listeningSessionCreation_Success.add(1)

      const listeningSessionID = JSON.parse(mainSession.body).data.createListeningSession.id
      //listeningSessionIds.push(listeningSessionID)
      // console.log("session creation: " , mainSession.status)

      const queueGen = '{"operationName":"AddToQueue","variables":{"input":{"songId":'+ String(Math.floor((Math.random()*5)+1)) +', "listeningSessionId":' + String(listeningSessionID) +'}},"query":"  mutation AddToQueue($input: QueueInfo!) { \\n addToQueue(input: $input) \\n}"}'
      const addToQueueWorked = http.post(
        'http://localhost:3000/graphql',
        queueGen,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if(addToQueueWorked.body.length === 0){
        console.log('No response body for queue creation received')
      }
      else if (addToQueueWorked.status >= 200 && addToQueueWorked.status < 300) {
        addToQueue_Success.add(1)
      }

      else{
        console.log('Queue Creation Status: ' + addToQueueWorked.status)
      }
    }
    else{
      console.log('Session Creation Status: ' + mainSession.status)
    }

  // const didAddToQueueWork = JSON.parse(addToQueueWorked.body).data.addToQueue
  // console.log("adding to queue: ", didAddToQueueWork)
  // console.log("adding to queue: ", didAddToQueueWork, " sessionID: ", listeningSessionID )

  }
  else{
    console.log('Party Rocker Creation Status: ' + mainPartyRocker.status)
  }
  // http.get('http://localhost:3000')
}


export function teardown() {

  //console.log(totalEntries)
  //delete the party rockers
  for (let i = 1; i < totalEntries+1; i++) {
    console.log(i)
    const deleteUser = http.post(
      'http://localhost:3000/graphql',
      '{"operationName":"DeletePartyRocker","variables":{"partyRockerId":' + i + '},"query":"mutation DeletePartyRocker($partyRockerId: Int!) { \\n deletePartyRocker(partyRockerId: $partyRockerId)}"}',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    //console.log(deleteUser.status)
    //console.log(deleteUser.body)

  }
  //delete the listensing sessions (and therefore the related queue)
  /*for (let i = 1; i < totalEntries+1; i++) {
    const deleteSession = http.post(
      'http://localhost:3000/graphql',
      '{"operationName":"DeleteListeningSession","variables":{"sessionId":' + i + '},"query":"mutation DeleteListeningSession($sessionId: Int!) { \\n deleteListeningSession(sessionId: $sessionId)}"}',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    //console.log(deleteSession.status)
    console.log(deleteSession.body)
  }*/
}



const count200 = new Counter('status_code_2xx')
const count300 = new Counter('status_code_3xx')
const count400 = new Counter('status_code_4xx')
const count500 = new Counter('status_code_5xx')

const rate200 = new Rate('rate_status_code_2xx')
const rate300 = new Rate('rate_status_code_3xx')
const rate400 = new Rate('rate_status_code_4xx')
const rate500 = new Rate('rate_status_code_5xx')

function recordRates(res) {
  if (res.status >= 200 && res.status < 300) {
    count200.add(1)
    rate200.add(1)
  } else if (res.status >= 300 && res.status < 400) {
//     console.log(res.body)
    count300.add(1)
    rate300.add(1)
  } else if (res.status >= 400 && res.status < 500) {
    count400.add(1)
    rate400.add(1)
  } else if (res.status >= 500 && res.status < 600) {
    count500.add(1)
    rate500.add(1)
  }
}
