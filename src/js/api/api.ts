import { error, info } from "../../utils/logger"
import { trakt } from "./trakt"

class Api {
  public readonly traktApi = trakt

  // tslint:disable-next-line readonly-keyword
  private videoToScrobbleTrakt: any

  private readonly percentageToConsiderWatched = 80

  // tslint:disable-next-line readonly-keyword
  private watched = false

  public readonly watchIfNecessary = async (
    name: string,
    progress: number,
    season: number,
    episode: number,
  ) => {
    if (progress < this.percentageToConsiderWatched || this.watched) {
      return
    }
    // tslint:disable-next-line no-object-mutation
    this.watched = true
    await this.stop(name, progress, season, episode)
    // tslint:disable-next-line no-floating-promises
    this.start(name, progress, season, episode)
    info("timeupdate")
  }

  public readonly start = async (
    name: string,
    progress: number,
    seasonNumber?: number,
    episodeNumber?: number,
  ) => {
    // tslint:disable-next-line no-object-mutation
    this.videoToScrobbleTrakt = await this.getVideoToScrobbleTrakt(
      name,
      seasonNumber,
      episodeNumber,
    )

    this.traktApi.scrobble
      .start({
        progress,
        [this.videoToScrobbleTrakt.type]: this.videoToScrobbleTrakt,
      })
      .catch((e: Error) => error(e))
  }

  public readonly stop = async (
    name: string,
    progress: number,
    seasonNumber?: number,
    episodeNumber?: number,
  ) => {
    try {
      // tslint:disable-next-line no-object-mutation
      this.videoToScrobbleTrakt = await this.getVideoToScrobbleTrakt(
        name,
        seasonNumber,
        episodeNumber,
      )

      const playOrPause = this.watched
        ? this.traktApi.scrobble.pause
        : this.traktApi.scrobble.stop

      await playOrPause({
        progress,
        [this.videoToScrobbleTrakt.type]: this.videoToScrobbleTrakt,
      })
    } catch (e) {
      const conflictCode = 409
      if (e.statusCode === conflictCode) {
        // tslint:disable-next-line no-object-mutation
        this.watched = true

        return
      }
      error(e)
    }
  }

  private readonly getVideoToScrobbleTrakt = async (
    name: string,
    season?: number,
    episode?: number,
  ) => {
    if (this.videoToScrobbleTrakt) {
      return this.videoToScrobbleTrakt
    }
    const results = await this.traktApi.search.text({
      extended: "full",
      fields: ["title", "translations", "aliases"],
      query: name,
      type: episode ? "show" : "movie",
    })

    if (results.length <= 0) {
      throw new Error(`${name} not found on Trakt`)
    }

    const video = results[0]

    const videoToScrobble = {
      ...(video.type === "show"
        ? await this.getEpisode(
            video.show.ids.slug,
            season as number,
            episode as number,
          )
        : video),
      type: video.type === "show" ? "episode" : video.type,
    }

    return videoToScrobble
  }

  private readonly getEpisode = async (
    id: string,
    season: number,
    episode: number,
  ) => {
    return trakt.episodes.summary({
      id,
      episode,
      season,
    })
  }
}

export const api = new Api()
