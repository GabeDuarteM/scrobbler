import * as CopyWebpackPlugin from "copy-webpack-plugin"
import * as ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import { join } from "path"
import * as webpack from "webpack"
import * as merge from "webpack-merge"

const baseConfig: webpack.Configuration = {
  entry: {
    crunchyroll: join(__dirname, "src", "inject", "crunchyroll.ts"),
    netflix: join(__dirname, "src", "inject", "netflix.ts"),
  },
  externals: {
    electron: "electron",
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
        test: /\.ts$/,
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: join(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: join("src", "icons"), to: "icons" },
      { from: join("src", "page_action"), to: "page_action" },
      { from: join("src", "manifest.json") },
    ]),
    new ForkTsCheckerWebpackPlugin({}),
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".js", ".json"],
  },
}

const devConfig: webpack.Configuration = {
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
}

const prodConfig: webpack.Configuration = {
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
    }),
  ],
}

export default ({
  env,
}: {
  readonly env: "development" | "production"
}): webpack.Configuration =>
  merge(baseConfig, env === "production" ? prodConfig : devConfig)
