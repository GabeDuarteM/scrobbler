import * as CopyWebpackPlugin from "copy-webpack-plugin"
import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import { join } from "path"
import * as webpack from "webpack"

const baseConfig: webpack.Configuration = {
  entry: {
    authSuccess: join(__dirname, "src", "authSuccess", "authSuccess.ts"),
    crunchyroll: join(__dirname, "src", "inject", "crunchyroll.ts"),
    netflix: join(__dirname, "src", "inject", "netflix.ts"),
    popup: join(__dirname, "src", "popup", "popup.ts"),
  },
  externals: {
    electron: "electron",
  },
  module: {
    rules: [
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
        test: /\.ts$/,
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: join("src", "icons"), to: "icons" },
      { from: join("src", "manifest.json") },
      { from: join("src", "popup", "popup.html") },
      { from: join("src", "popup", "popup.css") },
      { from: join("src", "authSuccess", "authSuccess.html") },
      { from: join("src", "authSuccess", "authSuccess.css") },
    ]),
    new ForkTsCheckerWebpackPlugin({}),
  ],
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
}

export default baseConfig
