import { error } from "../utils/logger"
import injectEventsOnVideo from "./injectEventsOnVideo"

const intervalMs = 500

const interval = setInterval(() => {
  try {
    const video = document.querySelector(".VideoContainer video")
    if (!video || (video && !(video instanceof HTMLVideoElement))) {
      return
    }
    const name = (document.querySelector(".video-title h4") as HTMLElement)
      .innerText
    const s00e00 = (document.querySelector(".video-title span") as HTMLElement)
      .innerText

    const rgxEpisodeSeason = /.*?(\d+):.*?(\d+)/
    const exec = rgxEpisodeSeason.exec(s00e00)
    if (!exec) {
      return
    }
    // tslint:disable-next-line no-unused-variable
    const [_, season, episode] = exec

    injectEventsOnVideo(
      document.querySelector(".VideoContainer video") as HTMLVideoElement,
      name,
      Number(season),
      Number(episode),
    )
  } catch (e) {
    error(e)
  }

  clearInterval(interval)
}, intervalMs)
