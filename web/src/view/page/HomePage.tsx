//import { useQuery } from '@apollo/client'
import { navigate, RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { Button, Form } from 'react-bootstrap'
import { Colors } from '../../../../common/src/colors'
//import { FetchListeningSession, FetchListeningSessionVariables } from '../../graphql/query.gen'
import { H1, H3 } from '../../style/header'
import { style } from '../../style/styled'
import { AppRouteParams, getPath, Route } from '../nav/route'
//import { fetchListeningSession } from '../playground/fetchListeningSession'
import { Page } from './Page'
// import { createPartyRocker } from '../playground/mutatePartyRockers'
// import { createListeningSession } from '../playground/mutateListeningSession'

interface HomePageProps extends RouteComponentProps, AppRouteParams { }

export function HomePage(props: HomePageProps) {
	const [username, setUsername] = React.useState("");
	const [sessionID, setSessionID] = React.useState("");



	function joinSession(): void {
		// <createPartyRocker/ >
		//const { data } = useQuery<FetchListeningSession, FetchListeningSessionVariables>(fetchListeningSession, { sessionId: 1 })
		const newURL = getPath(Route.LECTURES_NEW, { sessionID: 1 })
		console.log(newURL)
		navigate(newURL)
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
					<Form.Control type="text" placeholder="Session ID" onChange={(event) => setSessionID(event.target.value)} />
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
