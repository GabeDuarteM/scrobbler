import { debug, error, info, warn } from "./logger"

const consoleLog = console.log
const consoleError = console.error
const consoleWarn = console.warn

describe("logger", () => {
  /* tslint:disable no-object-mutation */
  beforeEach(() => {
    console.log = jest.fn()
    console.error = jest.fn()
    console.warn = jest.fn()
  })
  afterEach(() => {
    console.log = consoleLog
    console.error = consoleError
    console.warn = consoleWarn
  })
  /* tslint:enable no-object-mutation */
  describe("debug", () => {
    it("should call the log function with the right parameters", () => {
      debug("some debug message")

      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith(
        "SCROBBLER: [DEBUG] some debug message",
      )
    })
  })
  describe("error", () => {
    it("should call the log function with the right parameters", () => {
      error("some error message")

      expect(console.error).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith(
        "SCROBBLER: [ERROR] some error message",
      )
    })
  })
  describe("info", () => {
    it("should call the log function with the right parameters", () => {
      info("some info message")

      expect(console.log).toHaveBeenCalledTimes(1)
      expect(console.log).toHaveBeenCalledWith(
        "SCROBBLER: [INFO] some info message",
      )
    })
  })
  describe("warn", () => {
    it("should call the log function with the right parameters", () => {
      warn("some warn message")

      expect(console.warn).toHaveBeenCalledTimes(1)
      expect(console.warn).toHaveBeenCalledWith(
        "SCROBBLER: [WARNING] some warn message",
      )
    })
  })
})
