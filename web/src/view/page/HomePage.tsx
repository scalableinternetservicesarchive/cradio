//import { useQuery } from '@apollo/client'
import { useApolloClient } from '@apollo/client'
import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { Button, Form } from 'react-bootstrap'
import { Colors } from '../../../../common/src/colors'
import { H1, H3 } from '../../style/header'
import { style } from '../../style/styled'
import { AppRouteParams, getPath, Route } from '../nav/route'
import { fetchListeningSession } from '../playground/fetchListeningSession'
// import { createPartyRocker } from '../playground/mutatePartyRockers'
import { Page } from './Page'
// import { createListeningSession } from '../playground/mutateListeningSession'

interface HomePageProps extends RouteComponentProps, AppRouteParams { }

export function HomePage(props: HomePageProps) {
	const [username, setUsername] = React.useState("");
  const [sessionID, setSessionID] = React.useState(0);
  //const [getSession, { loading,data }] = useLazyQuery<FetchListeningSession, FetchListeningSessionVariables>(fetchListeningSession, { variables: { sessionId: sessionID}})
  const client = useApolloClient()

  //@ts-ignore
  const handleChange = async event => {
    await setSessionID(parseInt(event.target.value));
  };

	async function joinSession(event: React.MouseEvent): Promise<void> {
    console.log("in join session")
    event.preventDefault();

  console.log("sessionID from state", sessionID)
		// Verify a valid possible session ID was entered
		if (sessionID <= 0) { alert("Not a valid session id"); return; }

		// Fetch the session data from the database
  //	const { data } = useQuery<FetchListeningSession, FetchListeningSessionVariables>(fetchListeningSession, { variables: { sessionId: sessionID } })
  const { data } = await client.query({
    query: fetchListeningSession,  variables: { sessionId: sessionID}
  });
  // console.log("data from client query", data)
  //  await getSession()


    console.log("data", data)
		// Return if no session found
		if (data == null) { alert("Session not found."); return; }

    //Verify unique name. Create a new party rocker before joining the new session
    //@ts-ignore
		data.listeningSession?.partyRockers.forEach(element=> {
			if (element.name === username) { alert("Name taken."); return; }
		});

		// Create new party rocker
		// const { partyRocker } = createPartyRocker({ name: username });


    console.log("listening session id", data?.listeningSession?.id )
		// Add the party rocker to the session
    console.log("going to navigate to path: ", getPath(Route.LECTURES_NEW, { sessionId: data?.listeningSession?.id }))

    // Navigate to the specified session
    console.log("going to navigate to path: ", getPath(Route.LECTURES_NEW, { sessionId: data?.listeningSession?.id }))
    navigate(getPath(Route.LECTURES_NEW, { sessionId: data?.listeningSession?.id }))
	}

	// function createSession() {
	// 	// <createPartyRocker/ >
	// 	// <createListeningSession/ >
  // }


  //if (loading) return <p>Loading ...</p>;

	return (
		<Page>
			<Hero>
				<H1>Cradio</H1>
				<H3>Start Listening Parties with you friends! Request Music!</H3>
				<H3>UCLA, Fall 2020</H3>
				{username}
				{sessionID}
        {/* {'\n'}
        {data?.listeningSession?.timeCreated} */}

			</Hero>
			{/* Logo here */}
			<img src={"/app/assets/cradio.png"} />

			<Form>
				<Form.Group>
					<Form.Label>Name</Form.Label>
					<Form.Control type="text" placeholder="Username" onChange={(event) => setUsername(event.target.value)} />
					<Form.Text className="text-muted">
						Input your desired username.
    				</Form.Text>
				</Form.Group>

				<Form.Group>
					<Form.Label>Session ID</Form.Label>
					<Form.Control type="number" placeholder="Session ID" onChange={handleChange} />
				</Form.Group>
				<Button variant="primary" type="submit" onClick={joinSession} >
					Submit
       			</Button>
			</Form>
		</Page>
	)
}

const Hero = style('div', 'mb4 w-100 ba b--mid-gray br2 pa3 tc', {
  borderLeftColor: Colors.lemon + '!important',
  borderRightColor: Colors.lemon + '!important',
  borderLeftWidth: '4px',
  borderRightWidth: '4px',
})

// this is a test comment

// const Content = style('div', 'flex-l')

// const LContent = style('div', 'flex-grow-0 w-70-l mr4-l')

// const RContent = style('div', 'flex-grow-0  w-30-l')

// const Section = style('div', 'mb4 mid-gray ba b--mid-gray br2 pa3', (p: { $color?: ColorName }) => ({
//   borderLeftColor: Colors[p.$color || 'lemon'] + '!important',
//   borderLeftWidth: '3px',
// }))

// const TD = style('td', 'pa1', p => ({
//   color: p.$theme.textColor(),
// }))
