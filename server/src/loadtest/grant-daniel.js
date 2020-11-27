import http from 'k6/http'
import { sleep } from 'k6'
import { Counter, Rate } from 'k6/metrics'

export const options = {
  scenarios: {
    scenarios: {
      contacts: {
        executor: 'per-vu-iterations', //500 iterators each running the function once
        vus: 500,
        iterations: 1,
        maxDuration: '60s',
      },
    },
  }
}

const nameGen = '{"operationName":"CreatePartyRocker","variables":{"input":{"name":"' + String(__VU) + '"}},"query":"mutation CreatePartyRocker($input: PartyRockerInfo!) { \\n createPartyRocker(input: $input) { \\n id }}"}'

export function setup() {

  const mainPartyRocker = http.post(
    'http://localhost:3000/graphql',
    nameGen,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  sleep(Math.random(3));
  const mainID = JSON.parse(mainPartyRocker.body).data.createPartyRocker.id
  const sessGen = '{"operationName":"CreateListeningSession","variables":{"partyRockerId":' + String(mainID) + '},"query":"mutation CreateListeningSession($partyRockerId: Int!) {\\n createListeningSession(partyRockerId: $partyRockerId) { \\n id timeCreated }}"}'

  const mainSession = http.post(
    'http://localhost:3000/graphql',
    sessGen,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  const sessionID = JSON.parse(mainSession.body).data.createListeningSession.id
  console.log(mainID)
  console.log(sessionID)
  return {sessionID: sessionID}
}


export default function (data) {

  //user create a session, have 500 users join the session over some time period --> 60s

  const newPartyRocker = http.post(
    'http://localhost:3000/graphql',
    nameGen,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  console.log("sessionid", data.sessionID)
  const sessGen = `{"operationName":"JoinListeningSession","variables":{"input": {"partyRockerId":${JSON.parse(newPartyRocker.body).data.createPartyRocker.id}, "sessionId": ${data.sessionID}}},"query":"mutation JoinListeningSession($input: JoinSessionInfo!) {\\n joinListeningSession(input: $input)}"}`

  const joinSession = http.post(
    'http://localhost:3000/graphql',
    sessGen,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  console.log("join session body",joinSession.body)
}




export function teardown(data) {

  const deleteSessionResult = http.post(
    'http://localhost:3000/graphql',
    `{"operationName":"DeleteListeningSession","variables":{"sessionId":${data.sessionId}},"query":"mutation DeleteListeningSession($sessionId: Int!) { \\n deleteListeningSession(sessionId: $sessionId)}"}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  console.log(deleteSessionResult.body)

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