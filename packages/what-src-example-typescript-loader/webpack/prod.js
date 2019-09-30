// eslint-disable-next-line no-unused-vars
const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const base = require('./base')
const merge = require('webpack-merge')

/** @type {webpack.Configuration} */
module.exports = merge(base, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '..', 'public'),
    filename: '[name].[chunkhash].bundle.min.js',
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
})
