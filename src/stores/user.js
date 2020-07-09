import { writable } from "svelte/store";
const OAuthVK = require("electron-oauth-vk");

const initialState = {
  isAuth: false,
  token: "",
  userId: 0,
};

const vkAuth = async () => {
  const oauth = new OAuthVK(require("electron").remote.BrowserWindow, {
    clientID: 7531146,
    display: "page",
    scope: ["photos"],
    responseType: "token",
  });

  return await oauth.login().then(
    response => response,
    () => false,
  );
};

function createStore() {
  const { subscribe, set, update } = writable(initialState);

  return {
    subscribe,
    async auth() {
      if (localStorage.authData !== undefined) {
        const authData = JSON.parse(localStorage.authData);

        if (authData.expired > +new Date()) {
          return set({
            ...initialState,
            isAuth: true,
            token: authData.access_token,
            userId: authData.user_id,
          });
        }
      }

      const authData = await vkAuth();
      authData &&
        set({
          ...initialState,
          isAuth: true,
          token: authData.access_token,
          userId: authData.user_id,
        });

      localStorage.authData = JSON.stringify({
        expired: +new Date() + +authData.expires_in,
        access_token: authData.access_token,
        user_id: authData.user_id,
      });
    },
  };
}

export const user = createStore();
