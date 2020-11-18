import { useQuery } from '@apollo/client'
import { Grid } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/Add'
import { RouteComponentProps } from '@reach/router'
import * as React from 'react'
import { FetchListeningSession, FetchListeningSessionVariables, FetchSongs } from '../../graphql/query.gen'
import { AppRouteParams } from '../nav/route'
import { fetchListeningSession } from '../playground/fetchListeningSession'
import { fetchSongs } from '../playground/fetchSong'
import { addToQueue } from '../playground/mutateQueue'
import { Page } from './Page'

interface LecturesPageProps extends RouteComponentProps, AppRouteParams {}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}))

export function LecturesPage(props: LecturesPageProps) {
  return <SongList />
}

function SongList() {
  const classes = useStyles()
  const [dense] = React.useState(false)
  const [secondary] = React.useState(false)
  const { loading, data } = useQuery<FetchSongs>(fetchSongs)
  const sessionData = useQuery<FetchListeningSession, FetchListeningSessionVariables>(fetchListeningSession, {
    variables: { sessionId: 4 },
  }).data

  console.log(data)
  console.log(sessionData)
  if (loading) {
    return <div>loading...</div>
  }
  if (!data || data.songs.length === 0) {
    return <div>no songs</div>
  }

  const list2 = ['queue1', 'queue2']
  return (
    <Page>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Songs
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {data.songs.map(currSong => (
                <ListItem>
                  <ListItemIcon>
                    <AddIcon
                      onClick={() => {
                        console.log(currSong)
                        addToQueue({ songId: currSong.id, listeningSessionId: 4 })
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={currSong.name} secondary={secondary ? 'Secondary text' : null} />
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Session Queue
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {list2.map(currSong => (
                <ListItem>
                  <ListItemText primary={currSong} secondary={secondary ? 'Secondary text' : null} />
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
      </Grid>
    </Page>
  )
}
