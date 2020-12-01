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
import {
  FetchListeningSession,
  FetchListeningSessionVariables,
  FetchQueue,
  FetchQueueVariables,
  FetchSongs,
} from '../../graphql/query.gen'
import { AppRouteParams } from '../nav/route'
import { fetchListeningSession } from '../playground/fetchListeningSession'
import { fetchQueue } from '../playground/fetchQueue'
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
  const idSession = Number(props.sessionId)
  const classes = useStyles()
  const [dense] = React.useState(false)
  const [songQueue, setQueue] = React.useState<Array<string>>([])
  const [secondary] = React.useState(false)
  const { loading: loadingSongs, data: dataSongs } = useQuery<FetchSongs>(fetchSongs)
  // add `data: sessionData` to `const { loading: loadingSession }` on line 45 if you want to use the console.log on line 53.
  const { loading: loadingSession } = useQuery<FetchListeningSession, FetchListeningSessionVariables>(
    fetchListeningSession,
    {
      variables: { sessionId: idSession },
    }
  )

  //console.log(dataSongs)
  // console.log(sessionData)
  const { loading: loadingQueue, data: queueData } = useQuery<FetchQueue, FetchQueueVariables>(fetchQueue, {
    variables: { sessionId: idSession },
  })
  console.log(queueData)

  // React.useEffect(() =>{console.log("session Data", sessionData)}, [sessionData]
  // );
  if (loadingSession || loadingSongs || loadingQueue) {
    return <div>loading...</div>
  }
  if (!dataSongs || dataSongs.songs.length === 0) {
    return <div>no songs</div>
  }

  // if (queueData) {
  //   {
  //     queueData!.sessionQueue.map((currSong, index) => setQueue(current => [...current, currSong.song.name]))
  //   }
  // }

  return (
    <Page>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" className={classes.title}>
            Songs
          </Typography>
          <div className={classes.demo}>
            <List dense={dense}>
              {dataSongs.songs.map((currSong, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <AddIcon
                      onClick={() => {
                        setQueue(current => [...current, currSong.name])
                        addToQueue({ songId: currSong.id, listeningSessionId: idSession })
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
              {queueData!.sessionQueue.map((currSong, index) => (
                <ListItem key={index}>
                  <ListItemText primary={currSong.song.name} secondary={secondary ? 'Secondary text' : null} />
                </ListItem>
              ))}
              {songQueue.map((currSong, index) => (
                <ListItem key={index}>
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
