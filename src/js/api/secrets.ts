export const trakt = {
  clientId:
    process.env.NODE_ENV === "development"
      ? "b9cc71bf69e8928bc11bf26f2031881ba9fbe9bead4c66fbd3682e472bd4f1e2"
      : "0f5116c99d54c31d982986186a493409a50bb065306b1ade4876633c52641b46",
  clientSecret:
    process.env.NODE_ENV === "development"
      ? "e2ffe30d88e539cc0a6fd1193656332eb7bd921d98d9c711aa99bde763123ac4"
      : "c70d2fd0247c10058371adbcd6065f1557bcdab3d821515a992156c1ec66f85a",
}
