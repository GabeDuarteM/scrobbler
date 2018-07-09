export interface IIds {
  readonly trakt: number
  readonly slug?: string
  readonly tvdb?: number
  readonly imdb?: string
  readonly tmdb?: number
  readonly tvrage?: number
}

export interface IEpisode {
  readonly season: number
  readonly number: number
  readonly title: string
  readonly ids: IIds
  readonly number_abs?: number
  readonly overview: string
  readonly rating: number
  readonly votes: number
  readonly comment_count: number
  readonly first_aired?: Date
  readonly updated_at: Date
  readonly available_translations: ReadonlyArray<string>
  readonly runtime: number
}

export interface ISeason {
  readonly number: number
  readonly ids: IIds
  readonly rating: number
  readonly votes: number
  readonly episode_count: number
  readonly aired_episodes: number
  readonly title: string
  readonly overview?: any
  readonly first_aired: Date
  readonly network: string
  readonly episodes: ReadonlyArray<IEpisode>
}
