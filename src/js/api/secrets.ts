export const trakt = {
  clientId:
    process.env.NODE_ENV === "development"
      ? "YourStagingClientId"
      : "YourProdClientId",
  clientSecret:
    process.env.NODE_ENV === "development"
      ? "YourStagingSecret"
      : "YourProdClientSecret",
}
