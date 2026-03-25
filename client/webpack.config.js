const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    static: "./dist",
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};

// This Webpack configuration file is set up to bundle a React application. It specifies the entry point, output file, and development server settings. The Babel loader is used to transpile JavaScript and JSX files, excluding the node_modules directory. The configuration also resolves file extensions for easier imports.
// The development server serves static files from the "public" directory and runs on port 3000. This setup is typical for a React application using Webpack for bundling and Babel for transpilation.