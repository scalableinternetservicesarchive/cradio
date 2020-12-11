import { gql } from '@apollo/client'

// export const fragmentSurvey = gql`
//   fragment Survey on Survey {
//     id
//     name
//     isStarted
//     isCompleted
//     currentQuestion {
//       ...SurveyQuestion
//     }
//   }
// `

export const fragmentSong = gql`
  fragment Song on Song {
    id
    name
    genre
    duration
    artist {
      name
    }
  }
`

export const fetchSongs = gql`
  query FetchSongs {
    songs {
      ...Song
    }
  }
  ${fragmentSong}
`

export const fetchSong = gql`
  query FetchSong($songName: String!) {
    song(songName: $songName) {
      ...Song
    }
  }
  ${fragmentSong}
`
