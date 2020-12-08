import { GraphQLResolveInfo } from 'graphql'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } &
  { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export interface Query {
  __typename?: 'Query'
  self?: Maybe<User>
  surveys: Array<Survey>
  survey?: Maybe<Survey>
  artist?: Maybe<Artist>
  listeningSession?: Maybe<ListeningSession>
  sessionQueue: Array<Queue>
  partyRockers: Array<PartyRocker>
  song: Array<Song>
  songs: Array<Song>
}

export interface QuerySurveyArgs {
  surveyId: Scalars['Int']
}

export interface QueryArtistArgs {
  name: Scalars['String']
}

export interface QueryListeningSessionArgs {
  sessionId: Scalars['Int']
}

export interface QuerySessionQueueArgs {
  sessionId: Scalars['Int']
}

export interface QuerySongArgs {
  songName: Scalars['String']
}

export interface Mutation {
  __typename?: 'Mutation'
  answerSurvey: Scalars['Boolean']
  nextSurveyQuestion?: Maybe<Survey>
  addToQueue: Scalars['Boolean']
  createPartyRocker: PartyRocker
  createListeningSession: ListeningSession
  joinListeningSession: Scalars['Boolean']
  deleteListeningSession: Scalars['Boolean']
  deletePartyRocker: Scalars['Boolean']
}

export interface MutationAnswerSurveyArgs {
  input: SurveyInput
}

export interface MutationNextSurveyQuestionArgs {
  surveyId: Scalars['Int']
}

export interface MutationAddToQueueArgs {
  input: QueueInfo
}

export interface MutationCreatePartyRockerArgs {
  input: PartyRockerInfo
}

export interface MutationCreateListeningSessionArgs {
  partyRockerId: Scalars['Int']
}

export interface MutationJoinListeningSessionArgs {
  input: JoinSessionInfo
}

export interface MutationDeleteListeningSessionArgs {
  sessionId: Scalars['Int']
}

export interface MutationDeletePartyRockerArgs {
  partyRockerId: Scalars['Int']
}

export interface Subscription {
  __typename?: 'Subscription'
  surveyUpdates?: Maybe<Survey>
  queueUpdates?: Maybe<Queue>
}

export interface SubscriptionSurveyUpdatesArgs {
  surveyId: Scalars['Int']
}

export interface SubscriptionQueueUpdatesArgs {
  sessionId: Scalars['Int']
}

export interface User {
  __typename?: 'User'
  id: Scalars['Int']
  userType: UserType
  email: Scalars['String']
  name: Scalars['String']
}

export interface Song {
  __typename?: 'Song'
  id: Scalars['Int']
  name: Scalars['String']
  genre: Scalars['String']
  duration: Scalars['Int']
  artist: Artist
}

export interface Artist {
  __typename?: 'Artist'
  id: Scalars['Int']
  name: Scalars['String']
  origin?: Maybe<Scalars['String']>
  songs: Array<Maybe<Song>>
}

export interface ListeningSession {
  __typename?: 'ListeningSession'
  id: Scalars['Int']
  timeCreated: Scalars['Int']
  queueLength: Scalars['Int']
  owner: PartyRocker
  partyRockers: Array<PartyRocker>
  queue?: Maybe<Array<Queue>>
}

export interface PartyRocker {
  __typename?: 'PartyRocker'
  id: Scalars['Int']
  name: Scalars['String']
  spotifyCreds?: Maybe<Scalars['String']>
  listeningSession?: Maybe<ListeningSession>
}

export interface Queue {
  __typename?: 'Queue'
  id: Scalars['Int']
  score: Scalars['Int']
  position: Scalars['Int']
  song: Song
  listeningSession: ListeningSession
}

export enum UserType {
  Admin = 'ADMIN',
  User = 'USER',
}

export interface Survey {
  __typename?: 'Survey'
  id: Scalars['Int']
  name: Scalars['String']
  isStarted: Scalars['Boolean']
  isCompleted: Scalars['Boolean']
  currentQuestion?: Maybe<SurveyQuestion>
  questions: Array<Maybe<SurveyQuestion>>
}

export interface SurveyQuestion {
  __typename?: 'SurveyQuestion'
  id: Scalars['Int']
  prompt: Scalars['String']
  choices?: Maybe<Array<Scalars['String']>>
  answers: Array<SurveyAnswer>
  survey: Survey
}

export interface SurveyAnswer {
  __typename?: 'SurveyAnswer'
  id: Scalars['Int']
  answer: Scalars['String']
  question: SurveyQuestion
}

export interface SurveyInput {
  questionId: Scalars['Int']
  answer: Scalars['String']
}

export interface QueueInfo {
  songId: Scalars['Int']
  listeningSessionId: Scalars['Int']
}

export interface PartyRockerInfo {
  name: Scalars['String']
}

export interface JoinSessionInfo {
  partyRockerId: Scalars['Int']
  sessionId: Scalars['Int']
}

export type ResolverTypeWrapper<T> = Promise<T> | T

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>
  Int: ResolverTypeWrapper<Scalars['Int']>
  String: ResolverTypeWrapper<Scalars['String']>
  Mutation: ResolverTypeWrapper<{}>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Subscription: ResolverTypeWrapper<{}>
  User: ResolverTypeWrapper<User>
  Song: ResolverTypeWrapper<Song>
  Artist: ResolverTypeWrapper<Artist>
  ListeningSession: ResolverTypeWrapper<ListeningSession>
  PartyRocker: ResolverTypeWrapper<PartyRocker>
  Queue: ResolverTypeWrapper<Queue>
  UserType: UserType
  Survey: ResolverTypeWrapper<Survey>
  SurveyQuestion: ResolverTypeWrapper<SurveyQuestion>
  SurveyAnswer: ResolverTypeWrapper<SurveyAnswer>
  SurveyInput: SurveyInput
  QueueInfo: QueueInfo
  PartyRockerInfo: PartyRockerInfo
  JoinSessionInfo: JoinSessionInfo
}

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {}
  Int: Scalars['Int']
  String: Scalars['String']
  Mutation: {}
  Boolean: Scalars['Boolean']
  Subscription: {}
  User: User
  Song: Song
  Artist: Artist
  ListeningSession: ListeningSession
  PartyRocker: PartyRocker
  Queue: Queue
  Survey: Survey
  SurveyQuestion: SurveyQuestion
  SurveyAnswer: SurveyAnswer
  SurveyInput: SurveyInput
  QueueInfo: QueueInfo
  PartyRockerInfo: PartyRockerInfo
  JoinSessionInfo: JoinSessionInfo
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  self?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  surveys?: Resolver<Array<ResolversTypes['Survey']>, ParentType, ContextType>
  survey?: Resolver<
    Maybe<ResolversTypes['Survey']>,
    ParentType,
    ContextType,
    RequireFields<QuerySurveyArgs, 'surveyId'>
  >
  artist?: Resolver<Maybe<ResolversTypes['Artist']>, ParentType, ContextType, RequireFields<QueryArtistArgs, 'name'>>
  listeningSession?: Resolver<
    Maybe<ResolversTypes['ListeningSession']>,
    ParentType,
    ContextType,
    RequireFields<QueryListeningSessionArgs, 'sessionId'>
  >
  sessionQueue?: Resolver<
    Array<ResolversTypes['Queue']>,
    ParentType,
    ContextType,
    RequireFields<QuerySessionQueueArgs, 'sessionId'>
  >
  partyRockers?: Resolver<Array<ResolversTypes['PartyRocker']>, ParentType, ContextType>
  song?: Resolver<Array<ResolversTypes['Song']>, ParentType, ContextType, RequireFields<QuerySongArgs, 'songName'>>
  songs?: Resolver<Array<ResolversTypes['Song']>, ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  answerSurvey?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationAnswerSurveyArgs, 'input'>
  >
  nextSurveyQuestion?: Resolver<
    Maybe<ResolversTypes['Survey']>,
    ParentType,
    ContextType,
    RequireFields<MutationNextSurveyQuestionArgs, 'surveyId'>
  >
  addToQueue?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationAddToQueueArgs, 'input'>
  >
  createPartyRocker?: Resolver<
    ResolversTypes['PartyRocker'],
    ParentType,
    ContextType,
    RequireFields<MutationCreatePartyRockerArgs, 'input'>
  >
  createListeningSession?: Resolver<
    ResolversTypes['ListeningSession'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateListeningSessionArgs, 'partyRockerId'>
  >
  joinListeningSession?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationJoinListeningSessionArgs, 'input'>
  >
  deleteListeningSession?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteListeningSessionArgs, 'sessionId'>
  >
  deletePartyRocker?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationDeletePartyRockerArgs, 'partyRockerId'>
  >
}

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']
> = {
  surveyUpdates?: SubscriptionResolver<
    Maybe<ResolversTypes['Survey']>,
    'surveyUpdates',
    ParentType,
    ContextType,
    RequireFields<SubscriptionSurveyUpdatesArgs, 'surveyId'>
  >
  queueUpdates?: SubscriptionResolver<
    Maybe<ResolversTypes['Queue']>,
    'queueUpdates',
    ParentType,
    ContextType,
    RequireFields<SubscriptionQueueUpdatesArgs, 'sessionId'>
  >
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  userType?: Resolver<ResolversTypes['UserType'], ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SongResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Song'] = ResolversParentTypes['Song']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  genre?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  artist?: Resolver<ResolversTypes['Artist'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ArtistResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Artist'] = ResolversParentTypes['Artist']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  origin?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  songs?: Resolver<Array<Maybe<ResolversTypes['Song']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type ListeningSessionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ListeningSession'] = ResolversParentTypes['ListeningSession']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  timeCreated?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  queueLength?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  owner?: Resolver<ResolversTypes['PartyRocker'], ParentType, ContextType>
  partyRockers?: Resolver<Array<ResolversTypes['PartyRocker']>, ParentType, ContextType>
  queue?: Resolver<Maybe<Array<ResolversTypes['Queue']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type PartyRockerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PartyRocker'] = ResolversParentTypes['PartyRocker']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  spotifyCreds?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  listeningSession?: Resolver<Maybe<ResolversTypes['ListeningSession']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type QueueResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Queue'] = ResolversParentTypes['Queue']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  song?: Resolver<ResolversTypes['Song'], ParentType, ContextType>
  listeningSession?: Resolver<ResolversTypes['ListeningSession'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SurveyResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Survey'] = ResolversParentTypes['Survey']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  isStarted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  currentQuestion?: Resolver<Maybe<ResolversTypes['SurveyQuestion']>, ParentType, ContextType>
  questions?: Resolver<Array<Maybe<ResolversTypes['SurveyQuestion']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SurveyQuestionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SurveyQuestion'] = ResolversParentTypes['SurveyQuestion']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  prompt?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  choices?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  answers?: Resolver<Array<ResolversTypes['SurveyAnswer']>, ParentType, ContextType>
  survey?: Resolver<ResolversTypes['Survey'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type SurveyAnswerResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SurveyAnswer'] = ResolversParentTypes['SurveyAnswer']
> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  answer?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  question?: Resolver<ResolversTypes['SurveyQuestion'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}

export type Resolvers<ContextType = any> = {
  Query?: QueryResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Subscription?: SubscriptionResolvers<ContextType>
  User?: UserResolvers<ContextType>
  Song?: SongResolvers<ContextType>
  Artist?: ArtistResolvers<ContextType>
  ListeningSession?: ListeningSessionResolvers<ContextType>
  PartyRocker?: PartyRockerResolvers<ContextType>
  Queue?: QueueResolvers<ContextType>
  Survey?: SurveyResolvers<ContextType>
  SurveyQuestion?: SurveyQuestionResolvers<ContextType>
  SurveyAnswer?: SurveyAnswerResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>
