import { IIds, ISeason } from "../../@types/trakt"
import { error } from "../../utils/logger"
import { trakt } from "./trakt"

class Api {
  public readonly traktApi = trakt

  // tslint:disable-next-line readonly-keyword
  private videoToScrobbleTrakt: any

  private readonly percentageToConsiderWatched = 80

  // tslint:disable-next-line readonly-keyword
  private watched = false

  public readonly clearVideoInfo = () => {
    // tslint:disable-next-line no-object-mutation
    this.videoToScrobbleTrakt = null
    // tslint:disable-next-line no-object-mutation
    this.watched = false
  }
  public readonly watchIfNecessary = async (
    name: string,
    progress: number,
    season?: number,
    episode?: number,
  ) => {
    if (progress < this.percentageToConsiderWatched || this.watched) {
      return
    }
    await this.stop(name, progress, season, episode)
    // tslint:disable-next-line no-object-mutation
    this.watched = true
    // tslint:disable-next-line no-floating-promises
    this.start(name, progress, season, episode)
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

  public readonly getEpisodeStandard = async (
    id: string,
    season: number,
    episode: number,
  ) =>
    trakt.episodes.summary({
      id,
      episode,
      season,
    })

  public readonly getEpisodeAbsolute = async (
    name: string,
    episodeNumber: number,
  ) => {
    const series = await trakt.search.text({ query: name, type: "show" })
    const ids: IIds = series[0].show.ids
    const epNotFoundMsg = "Episode not found"

    const seasonsDenormalized: ReadonlyArray<
      ISeason
    > = await trakt.seasons.summary({
      id: ids.slug,
      extended: "episodes",
    })
    const seasons = this.normalizeSeasons(seasonsDenormalized)

    let totalEpisodeCount = 0

    for (const season of seasons) {
      totalEpisodeCount += season.episodes.length
      if (totalEpisodeCount < episodeNumber) {
        continue
      }
      const totalEpisodesBeforeCurrSeason =
        totalEpisodeCount - season.episodes.length
      const epNumber = episodeNumber - totalEpisodesBeforeCurrSeason
      const episode = season.episodes.find(x => x.number === epNumber)
      if (episode === undefined) {
        error(epNotFoundMsg)

        throw new Error(epNotFoundMsg)
      }

      return episode
    }

    throw new Error(epNotFoundMsg)
  }

  private readonly normalizeSeasons = (seasons: ReadonlyArray<ISeason>) =>
    seasons.filter(season => season.number !== 0).map(season => ({
      ...season,
      episodes: season.episodes.filter(episode => episode.title !== null),
    }))

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
        ? await this.getEpisodeStandard(
            video.show.ids.slug,
            season as number,
            episode as number,
          )
        : video.movie),
      type: video.type === "show" ? "episode" : video.type,
    }

    return videoToScrobble
  }
}

export const api = new Api()
