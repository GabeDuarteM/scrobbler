// tslint:disable-next-line:no-object-mutation
;(global as any).chrome = {
  storage: {
    sync: {
      get: jest.fn((storageKey, callback) => {
        const val = {
          access_token: "access_token",
          expires: 55,
          refresh_token: "refresh_token",
        }

        callback(val)
      }),
    },
  },
}
