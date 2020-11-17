//import { useQuery } from '@apollo/client'
import { useQuery } from '@apollo/client'
import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { Button, Form } from 'react-bootstrap'
import { Colors } from '../../../../common/src/colors'
import { FetchListeningSession, FetchListeningSessionVariables } from '../../graphql/query.gen'
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



	function joinSession(): void {
		// Verify a valid possible session ID was entered
		if (sessionID <= 0) { alert("Not a valid session id"); return; }

		// Fetch the session data from the database
		const { data } = useQuery<FetchListeningSession, FetchListeningSessionVariables>(fetchListeningSession, { variables: { sessionId: sessionID } })

		// Return if no session found
		if (data == null) { alert("Session not found."); return; }

		// Verify unique name. Create a new party rocker before joining the new session
		data.listeningSession?.partyRockers.forEach(element => {
			if (element.name === username) { alert("Name taken."); return; }
		});

		// Create new party rocker
		// const { partyRocker } = createPartyRocker({ name: username });

		// Add the party rocker to the session


		// Navigate to the specified session
		navigate(getPath(Route.LECTURES_NEW, { sessionId: data?.listeningSession?.id }))
	}

	// function createSession() {
	// 	// <createPartyRocker/ >
	// 	// <createListeningSession/ >
	// }

	return (
		<Page>
			<Hero>
				<H1>Cradio</H1>
				<H3>Start Listening Parties with you friends! Request Music!</H3>
				<H3>UCLA, Fall 2020</H3>
				{username}
				{sessionID}
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
					<Form.Control type="number" placeholder="Session ID" onChange={(event) => setSessionID(Number(event.target.value))} />
				</Form.Group>
				<Button variant="primary" type="submit" onClick={() => joinSession()} >
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
