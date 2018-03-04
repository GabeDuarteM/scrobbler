import { isEqual } from "lodash"
import IWatchingVideo from "../@types/IWatchingVideo"
import { api } from "../js/api/api"
import { error } from "../utils/logger"
import injectEventsOnVideo from "./injectEventsOnVideo"

const intervalMs = 500

let currentWatchingVideo: IWatchingVideo | null

setInterval(() => {
  try {
    const isWatchingVideo = document.querySelector(".PlayerControls--container")
    if (!isWatchingVideo) {
      if (currentWatchingVideo) {
        // tslint:disable-next-line no-floating-promises
        api.stop(
          currentWatchingVideo.name,
          0,
          currentWatchingVideo.season,
          currentWatchingVideo.episode,
        )
      }
      currentWatchingVideo = null
      api.clearVideoInfo()

      return
    }

    const video = document.querySelector(".VideoContainer video")
    if (!video || (video && !(video instanceof HTMLVideoElement))) {
      return
    }

    const name = (document.querySelector(".video-title h4") as HTMLElement)
      .innerText
    const s00e00 = document.querySelector(".video-title span") as HTMLElement

    let toBeComparedCurrentWatchingVideo: IWatchingVideo = {
      name,
      type: s00e00 ? "episode" : "movie",
    }

    if (s00e00) {
      const rgxEpisodeSeason = /.*?(\d+):.*?(\d+)/
      const exec = rgxEpisodeSeason.exec(s00e00.innerText)
      if (!exec) {
        return
      }
      // tslint:disable-next-line no-unused-variable
      const [_, season, episode] = exec
      toBeComparedCurrentWatchingVideo = {
        ...toBeComparedCurrentWatchingVideo,
        season: Number(season),
        episode: Number(episode),
      }
    }

    if (isEqual(toBeComparedCurrentWatchingVideo, currentWatchingVideo)) {
      return
    }

    currentWatchingVideo = { ...toBeComparedCurrentWatchingVideo }

    injectEventsOnVideo(
      document.querySelector(".VideoContainer video") as HTMLVideoElement,
      currentWatchingVideo.name,
      currentWatchingVideo.season,
      currentWatchingVideo.episode,
    )
  } catch (e) {
    error(e)
  }
}, intervalMs)
