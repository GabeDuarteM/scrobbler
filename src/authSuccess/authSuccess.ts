import { trakt } from "../js/api/trakt"

const url = new URL(location.href)
const code = url.searchParams.get("code")

trakt.exchange_code(code).then(() => {
  chrome.storage.sync.set({ token: trakt.export_token() })
})
