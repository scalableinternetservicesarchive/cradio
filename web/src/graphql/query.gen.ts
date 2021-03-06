/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchUserContext
// ====================================================

export interface FetchUserContext_self {
  __typename: "User";
  id: number;
  name: string;
  userType: UserType;
}

export interface FetchUserContext {
  self: FetchUserContext_self | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchListeningSession
// ====================================================

export interface FetchListeningSession_listeningSession_owner_listeningSession {
  __typename: "ListeningSession";
  id: number;
}

export interface FetchListeningSession_listeningSession_owner {
  __typename: "PartyRocker";
  id: number;
  name: string;
  spotifyCreds: string | null;
  listeningSession: FetchListeningSession_listeningSession_owner_listeningSession | null;
}

export interface FetchListeningSession_listeningSession_partyRockers_listeningSession {
  __typename: "ListeningSession";
  id: number;
}

export interface FetchListeningSession_listeningSession_partyRockers {
  __typename: "PartyRocker";
  id: number;
  name: string;
  spotifyCreds: string | null;
  listeningSession: FetchListeningSession_listeningSession_partyRockers_listeningSession | null;
}

export interface FetchListeningSession_listeningSession {
  __typename: "ListeningSession";
  id: number;
  timeCreated: number;
  owner: FetchListeningSession_listeningSession_owner;
  partyRockers: FetchListeningSession_listeningSession_partyRockers[];
}

export interface FetchListeningSession {
  listeningSession: FetchListeningSession_listeningSession | null;
}

export interface FetchListeningSessionVariables {
  sessionId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchPartyRocker
// ====================================================

export interface FetchPartyRocker_partyRockers_listeningSession {
  __typename: "ListeningSession";
  id: number;
}

export interface FetchPartyRocker_partyRockers {
  __typename: "PartyRocker";
  id: number;
  name: string;
  spotifyCreds: string | null;
  listeningSession: FetchPartyRocker_partyRockers_listeningSession | null;
}

export interface FetchPartyRocker {
  partyRockers: FetchPartyRocker_partyRockers[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchQueue
// ====================================================

export interface FetchQueue_sessionQueue_song_artist {
  __typename: "Artist";
  name: string;
}

export interface FetchQueue_sessionQueue_song {
  __typename: "Song";
  name: string;
  genre: string;
  duration: number;
  artist: FetchQueue_sessionQueue_song_artist;
}

export interface FetchQueue_sessionQueue {
  __typename: "Queue";
  id: number;
  score: number;
  position: number;
  song: FetchQueue_sessionQueue_song;
}

export interface FetchQueue {
  sessionQueue: FetchQueue_sessionQueue[];
}

export interface FetchQueueVariables {
  sessionId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: QueueSubscription
// ====================================================

export interface QueueSubscription_queueUpdates_song_artist {
  __typename: "Artist";
  name: string;
}

export interface QueueSubscription_queueUpdates_song {
  __typename: "Song";
  name: string;
  genre: string;
  duration: number;
  artist: QueueSubscription_queueUpdates_song_artist;
}

export interface QueueSubscription_queueUpdates_listeningSession {
  __typename: "ListeningSession";
  id: number;
}

export interface QueueSubscription_queueUpdates {
  __typename: "Queue";
  id: number;
  score: number;
  position: number;
  song: QueueSubscription_queueUpdates_song;
  listeningSession: QueueSubscription_queueUpdates_listeningSession;
}

export interface QueueSubscription {
  queueUpdates: QueueSubscription_queueUpdates | null;
}

export interface QueueSubscriptionVariables {
  sessionId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchSongs
// ====================================================

export interface FetchSongs_songs_artist {
  __typename: "Artist";
  name: string;
}

export interface FetchSongs_songs {
  __typename: "Song";
  id: number;
  name: string;
  genre: string;
  duration: number;
  artist: FetchSongs_songs_artist;
}

export interface FetchSongs {
  songs: FetchSongs_songs[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchSong
// ====================================================

export interface FetchSong_song_artist {
  __typename: "Artist";
  name: string;
}

export interface FetchSong_song {
  __typename: "Song";
  id: number;
  name: string;
  genre: string;
  duration: number;
  artist: FetchSong_song_artist;
}

export interface FetchSong {
  song: FetchSong_song[];
}

export interface FetchSongVariables {
  songName: string;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchSurveys
// ====================================================

export interface FetchSurveys_surveys_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface FetchSurveys_surveys_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: FetchSurveys_surveys_currentQuestion_answers[];
}

export interface FetchSurveys_surveys {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: FetchSurveys_surveys_currentQuestion | null;
}

export interface FetchSurveys {
  surveys: FetchSurveys_surveys[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: SurveySubscription
// ====================================================

export interface SurveySubscription_surveyUpdates_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface SurveySubscription_surveyUpdates_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: SurveySubscription_surveyUpdates_currentQuestion_answers[];
}

export interface SurveySubscription_surveyUpdates {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: SurveySubscription_surveyUpdates_currentQuestion | null;
}

export interface SurveySubscription {
  surveyUpdates: SurveySubscription_surveyUpdates | null;
}

export interface SurveySubscriptionVariables {
  surveyId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FetchSurvey
// ====================================================

export interface FetchSurvey_survey_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface FetchSurvey_survey_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: FetchSurvey_survey_currentQuestion_answers[];
}

export interface FetchSurvey_survey {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: FetchSurvey_survey_currentQuestion | null;
}

export interface FetchSurvey {
  survey: FetchSurvey_survey | null;
}

export interface FetchSurveyVariables {
  surveyId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteListeningSession
// ====================================================

export interface DeleteListeningSession {
  deleteListeningSession: boolean;
}

export interface DeleteListeningSessionVariables {
  sessionId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateListeningSession
// ====================================================

export interface CreateListeningSession_createListeningSession {
  __typename: "ListeningSession";
  id: number;
  timeCreated: number;
}

export interface CreateListeningSession {
  createListeningSession: CreateListeningSession_createListeningSession;
}

export interface CreateListeningSessionVariables {
  partyRockerId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: JoinListeningSession
// ====================================================

export interface JoinListeningSession {
  joinListeningSession: boolean;
}

export interface JoinListeningSessionVariables {
  input: JoinSessionInfo;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePartyRocker
// ====================================================

export interface CreatePartyRocker_createPartyRocker {
  __typename: "PartyRocker";
  id: number;
}

export interface CreatePartyRocker {
  createPartyRocker: CreatePartyRocker_createPartyRocker;
}

export interface CreatePartyRockerVariables {
  input: PartyRockerInfo;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddToQueue
// ====================================================

export interface AddToQueue {
  addToQueue: boolean;
}

export interface AddToQueueVariables {
  input: QueueInfo;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AnswerSurveyQuestion
// ====================================================

export interface AnswerSurveyQuestion {
  answerSurvey: boolean;
}

export interface AnswerSurveyQuestionVariables {
  input: SurveyInput;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NextSurveyQuestion
// ====================================================

export interface NextSurveyQuestion_nextSurveyQuestion_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface NextSurveyQuestion_nextSurveyQuestion_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: NextSurveyQuestion_nextSurveyQuestion_currentQuestion_answers[];
}

export interface NextSurveyQuestion_nextSurveyQuestion {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: NextSurveyQuestion_nextSurveyQuestion_currentQuestion | null;
}

export interface NextSurveyQuestion {
  nextSurveyQuestion: NextSurveyQuestion_nextSurveyQuestion | null;
}

export interface NextSurveyQuestionVariables {
  surveyId: number;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ListeningSession
// ====================================================

export interface ListeningSession_owner_listeningSession {
  __typename: "ListeningSession";
  id: number;
}

export interface ListeningSession_owner {
  __typename: "PartyRocker";
  id: number;
  name: string;
  spotifyCreds: string | null;
  listeningSession: ListeningSession_owner_listeningSession | null;
}

export interface ListeningSession_partyRockers_listeningSession {
  __typename: "ListeningSession";
  id: number;
}

export interface ListeningSession_partyRockers {
  __typename: "PartyRocker";
  id: number;
  name: string;
  spotifyCreds: string | null;
  listeningSession: ListeningSession_partyRockers_listeningSession | null;
}

export interface ListeningSession {
  __typename: "ListeningSession";
  id: number;
  timeCreated: number;
  owner: ListeningSession_owner;
  partyRockers: ListeningSession_partyRockers[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: PartyRocker
// ====================================================

export interface PartyRocker_listeningSession {
  __typename: "ListeningSession";
  id: number;
}

export interface PartyRocker {
  __typename: "PartyRocker";
  id: number;
  name: string;
  spotifyCreds: string | null;
  listeningSession: PartyRocker_listeningSession | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Queue
// ====================================================

export interface Queue_song_artist {
  __typename: "Artist";
  name: string;
}

export interface Queue_song {
  __typename: "Song";
  name: string;
  genre: string;
  duration: number;
  artist: Queue_song_artist;
}

export interface Queue {
  __typename: "Queue";
  id: number;
  score: number;
  position: number;
  song: Queue_song;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Song
// ====================================================

export interface Song_artist {
  __typename: "Artist";
  name: string;
}

export interface Song {
  __typename: "Song";
  id: number;
  name: string;
  genre: string;
  duration: number;
  artist: Song_artist;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Survey
// ====================================================

export interface Survey_currentQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface Survey_currentQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: Survey_currentQuestion_answers[];
}

export interface Survey {
  __typename: "Survey";
  id: number;
  name: string;
  isStarted: boolean;
  isCompleted: boolean;
  currentQuestion: Survey_currentQuestion | null;
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: SurveyQuestion
// ====================================================

export interface SurveyQuestion_answers {
  __typename: "SurveyAnswer";
  answer: string;
}

export interface SurveyQuestion {
  __typename: "SurveyQuestion";
  id: number;
  prompt: string;
  choices: string[] | null;
  answers: SurveyQuestion_answers[];
}

/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserType {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface JoinSessionInfo {
  partyRockerId: number;
  sessionId: number;
}

export interface PartyRockerInfo {
  name: string;
}

export interface QueueInfo {
  songId: number;
  listeningSessionId: number;
}

export interface SurveyInput {
  questionId: number;
  answer: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
