const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { WhatSrcServerWebpackPlugin } = require('@what-src/plugin')
const { whatSrcServerTsLoaderPlugin } = require('@what-src/plugin')

/** @type {webpack.Configuration} */
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '..', 'public'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [whatSrcServerTsLoaderPlugin()],
              }),
            },
          },
        ],
      },
    ],
  },
  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimize: false,
    runtimeChunk: {
      name: 'manifest',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  devServer: {
    contentBase: path.join(__dirname, '..', 'public'),
    compress: true,
    port: 9000,
    // open: true,
    writeToDisk: true,
    overlay: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new ForkTsCheckerWebpackPlugin(),
    new WhatSrcServerWebpackPlugin(),
  ],
}
