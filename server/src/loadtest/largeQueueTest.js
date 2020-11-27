import http from 'k6/http'
import { sleep } from 'k6'
import { Counter, Rate } from 'k6/metrics'

export const options = {
  // scenarios: {
  //   example_scenario: {
  //     // name of the executor to use
  //     executor: 'ramping-vus',
  //     startVUs: 0,
  //     stages: [
  //       { target: 500, duration: '60s' },
  //       { target: 0, duration: '60s' },
  //     ],
  //     gracefulRampDown: '0s',
  //   },
  // },
  scenarios: {
    contacts: {
      executor: 'per-vu-iterations', //500 iterators each running the function once
      vus: 40,
      iterations: 1,
      maxDuration: '30s',
    },
  },
}

export function setup() {
  //Create party rocker so that you can create a listneing session with them as the owner
  const createPartyRockerresult = http.post(
    'http://localhost:3000/graphql',
    '{"operationName":"CreatePartyRocker","variables":{"input":{"name":"HugeQueueBoi"}},"query":"mutation CreatePartyRocker($input: PartyRockerInfo!) { \\n createPartyRocker(input: $input) { \\n id }}"}',
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  //  console.log('partyRockerCreateResul', createPartyRockerresult.body)
  const jsonResult = JSON.parse(createPartyRockerresult.body)
  //console.log('jsonResult', jsonResult.data.createPartyRocker.id)

  //create listening session to queue the songs in
  const createSessionResult = http.post(
    'http://localhost:3000/graphql',
    `{"operationName":"CreateListeningSession","variables":{"partyRockerId":${jsonResult.data.createPartyRocker.id}},"query":"mutation CreateListeningSession($partyRockerId: Int!) { \\n createListeningSession(partyRockerId: $partyRockerId) { \\n id }}"}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  // console.log(createSessionResult.body)

  const sessionJson = JSON.parse(createSessionResult.body)
  //console.log('createSession json result', sessionJson.data.createListeningSession.id)

  return { sessionId: sessionJson.data.createListeningSession.id }
}

export default function (data) {
  // recordRates(

  const sleepTime = Math.floor(Math.random() * Math.floor(20)) + 1
  console.log('sleeping for: ', sleepTime)
  sleep(sleepTime)

  //we want to queue a "random" song out of the list of songs instead of queueing the same song every time
  //generate a song id to use
  //does this add to the time taken???????
  const songId = (__VU % 6) + 1

  const addToQueueResult = http.post(
    'http://localhost:3000/graphql',
    `{"operationName":"AddToQueue","variables":{"input": {"songId":${songId}, "listeningSessionId": ${data.sessionId}}},"query":"mutation AddToQueue($input: QueueInfo!) { \\n addToQueue(input: $input)}"}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  //record rates and counts of status counts
  recordRates(addToQueueResult)
}

// export function teardown(data) {
//   //delete the listensing session (and therefore the related queue)
//   const deleteSessionResult = http.post(
//     'http://localhost:3000/graphql',
//     `{"operationName":"DeleteListeningSession","variables":{"sessionId":${data.sessionId}},"query":"mutation DeleteListeningSession($sessionId: Int!) { \\n deleteListeningSession(sessionId: $sessionId)}"}`,
//     {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }
//   )

//   console.log(deleteSessionResult.body)
// }

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
    console.log(res.body)
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
