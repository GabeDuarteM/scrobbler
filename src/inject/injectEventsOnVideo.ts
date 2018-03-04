import { throttle } from "lodash"
import { api } from "../js/api/api"

const injectEventsOnVideo = (
  video: HTMLVideoElement,
  name: string,
  season?: number,
  episode?: number,
) => {
  const boundPlayOrSeek = playOrSeek.bind(null, video, name, season, episode)
  boundPlayOrSeek()

  const throttleWaitTime = 5000
  const throttledTimeUpdate = throttle(() => {
    // tslint:disable-next-line no-floating-promises
    api.watchIfNecessary(name, getProgress(video), season, episode)
  }, throttleWaitTime)

  video.addEventListener("seeked", boundPlayOrSeek)
  video.addEventListener("play", boundPlayOrSeek)
  video.addEventListener("pause", () => {
    // tslint:disable-next-line no-floating-promises
    api.stop(name, getProgress(video), Number(season), Number(episode))
  })
  video.addEventListener("timeupdate", throttledTimeUpdate)
}

const playOrSeek = (
  video: HTMLVideoElement,
  name: string,
  season?: number,
  episode?: number,
) => {
  const progress = getProgress(video)
  // tslint:disable-next-line no-floating-promises
  api.start(name, progress, Number(season), Number(episode))
}

const getProgress = (video: HTMLVideoElement): number => {
  const fullDurationPercent = 100
  const progress = Math.floor(
    video.currentTime / video.duration * fullDurationPercent,
  )

  return progress
}

export default injectEventsOnVideo
