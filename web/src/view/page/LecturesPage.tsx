import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { useState } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { AppRouteParams } from '../nav/route'
import { Page } from './Page'


interface LecturesPageProps extends RouteComponentProps, AppRouteParams {}

export function LecturesPage(props: LecturesPageProps) {
  const [sessions] = useState(["Session 1", "Session 2", "Session 3"]);
  return (
    <Page>
      <div>
        <ListGroup>
          {sessions.map(id => (<ListGroup.Item>{id}</ListGroup.Item>))}
        </ListGroup>
        </div>
    </Page>
  )
}
