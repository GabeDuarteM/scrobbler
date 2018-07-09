import IWatchingVideo from "../@types/IWatchingVideo"
import { api } from "../js/api/api"
import { error } from "../utils/logger"
import injectEventsOnVideo from "./injectEventsOnVideo"

const getAbsoluteEp = () => {
  const pathnameArray = location.pathname.split("/")
  const episodePathname = pathnameArray[pathnameArray.length - 1]
  const regexAbsoluteEp = /.*?-(\d+)-/
  const match = regexAbsoluteEp.exec(episodePathname)
  if (!match) {
    throw new Error("Path did not have a valid absolute ep.")
  }
  const absoluteEp = match[1]

  return Number(absoluteEp)
}

const convertAbsoluteToSeasonNumbering = async (
  name: string,
  absoluteEp: number,
) => {
  const ep = await api.getEpisodeAbsolute(name, absoluteEp)

  return { season: ep.season, episode: ep.number }
}

let currentWatchingVideo: IWatchingVideo | null
// tslint:disable-next-line no-floating-promises
;(async () => {
  try {
    const video = document.querySelector(".html5-video-container video")
    if (!video || (video && !(video instanceof HTMLVideoElement))) {
      return
    }

    const name = (document.querySelector(
      ".showmedia-header.cf h1 [itemprop='title']",
    ) as HTMLElement).innerText

    const absoluteEp = getAbsoluteEp()

    const seasonNumberObj = await convertAbsoluteToSeasonNumbering(
      name,
      absoluteEp,
    )

    const toBeComparedCurrentWatchingVideo: IWatchingVideo = {
      name,
      type: "episode",
      ...seasonNumberObj,
    }

    currentWatchingVideo = { ...toBeComparedCurrentWatchingVideo }

    injectEventsOnVideo(
      video,
      currentWatchingVideo.name,
      currentWatchingVideo.season,
      currentWatchingVideo.episode,
    )
  } catch (e) {
    error(e)
  }
})()
