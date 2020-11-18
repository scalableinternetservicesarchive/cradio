import http from 'k6/http'
import { sleep } from 'k6'
import { Counter, Rate } from 'k6/metrics'

export const options = {
  scenarios: {
    example_scenario: {
      // name of the executor to use
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { target: 500, duration: '60s' },
        { target: 0, duration: '60s' },
      ],
      gracefulRampDown: '0s',
    },
  },
}

export default function () {
  // recordRates(
  // const resp =
  const nameGen = '{"operationName":"CreatePartyRocker","variables":{"input":{"name":"' + String(__VU) + '"}},"query":"mutation CreatePartyRocker($input: PartyRockerInfo!) { \\n createPartyRocker(input: $input) { \\n id }}"}'
  http.post(
    'http://localhost:3000/graphql',
    //'{"operationName":"CreatePartyRocker","variables":{"input":{"name":"${String(__VU)}"}},"query":"mutation CreatePartyRocker($input: PartyRockerInfo!) { \\n createPartyRocker/////(input: $input) { \\n id }}"}',
    nameGen,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  sleep(Math.random(3));
  const sessGen = '{"operationName":"CreateListeningSession","variables":{"partyRockerId":' + String(__VU) + '},"query":"mutation CreateListeningSession($partyRockerId: Int!) {\\n createListeningSession(partyRockerId: $partyRockerId) { \\n id timeCreated }}"}'
  http.post(
    'http://localhost:3000/graphql',
    sessGen,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  // )
  /*sleep(1)
  http.get('http://localhost:3000')*/
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