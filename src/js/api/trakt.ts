import * as Trakt from "trakt.tv"
import { trakt as traktSecrets } from "./secrets"

const options = {
  api_url:
    process.env.NODE_ENV === "development"
      ? "https://api-staging.trakt.tv"
      : "https://api.trakt.tv",
  client_id: traktSecrets.clientId,
  client_secret: traktSecrets.clientSecret,
  redirect_uri:
    "chrome-extension://cngpkaebaeagbhgdpbdlokkkpeibomhl/authSuccess.html",
}

chrome.storage.sync.get("token", val => {
  if (val.token) {
    trakt.import_token(val.token)
  }
})

export const trakt = new Trakt(options)
