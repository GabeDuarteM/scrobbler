import { updateUI } from "./updateUi"

jest.mock("./updateUi")

describe("popup", () => {
  it("should call updateUi", () => {
    expect(updateUI).toHaveBeenCalledTimes(1)
  })
})
