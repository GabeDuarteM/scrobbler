interface IWatchingVideo {
  readonly name: string
  readonly type: "episode" | "movie"
  readonly season?: number
  readonly episode?: number
}

export default IWatchingVideo
