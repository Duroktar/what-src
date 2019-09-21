// eslint-disable-next-line no-unused-vars
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { WhatSrcServerWebpackPlugin } = require('@what-src/plugin')

/** @type {webpack.Configuration} */
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              ['module:@what-src/plugin',
              {
                productionMode: true,
                useRemote: true,
                enableXkcdMode: true
              }]],
          },
        },
      },
    ],
  },
  resolve: {
    // TODO: Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.js', 'jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new WhatSrcServerWebpackPlugin(),
  ],
}
