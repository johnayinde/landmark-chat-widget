// webpack.config.js - Updated to handle environment variables properly
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/widget-entry.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "landmark-chat-widget.js",
    library: "LandmarkChatWidget",
    libraryTarget: "umd",
    globalObject: "this",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  plugins: [
    // Define environment variables for the browser
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(
        process.env.NODE_ENV || "production"
      ),
      "process.env.REACT_APP_API_URL": JSON.stringify(
        process.env.REACT_APP_API_URL || ""
      ),
      "process.env.REACT_APP_API_KEY": JSON.stringify(
        process.env.REACT_APP_API_KEY || ""
      ),
      "process.env.REACT_APP_DEMO": JSON.stringify(
        process.env.REACT_APP_DEMO || "true"
      ),
    }),
  ],
  mode: "production",
  optimization: {
    minimize: true,
  },
};
