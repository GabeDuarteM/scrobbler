import IChromeObj from "../@types/IChromeObj"
import IToken from "../@types/IToken"
import { api } from "../js/api/api"
import { error } from "../utils/logger"

export const updateUI = (): void => {
  chrome.storage.sync.get("token", (val: IChromeObj<IToken>) => {
    const btn = document.querySelector("#btn-auth")

    if (!btn || !(btn instanceof HTMLAnchorElement)) {
      error("Authorization button not found")

      return
    }

    if (val.token && val.token.access_token) {
      addLogoutVisuals(btn)

      api.traktApi.import_token(val.token)
    } else {
      addLoginVisuals(btn)

      btn.setAttribute("href", api.traktApi.get_url())
    }
  })
}

const addLogoutVisuals = (btn: HTMLAnchorElement) => {
  btn.classList.add("logout")
  btn.classList.remove("login")
  // tslint:disable-next-line no-object-mutation
  btn.innerText = "Logout"
  btn.addEventListener("click", logout)
}

const addLoginVisuals = (btn: HTMLAnchorElement) => {
  btn.classList.add("login")
  btn.classList.remove("logout")
  // tslint:disable-next-line no-object-mutation
  btn.innerText = "Authorize"
}

const logout = (): void => {
  api.traktApi.revoke_token()
  chrome.storage.sync.set({ token: null }, () => {
    updateUI()
  })
}
