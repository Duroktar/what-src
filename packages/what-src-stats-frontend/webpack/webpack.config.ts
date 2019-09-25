import path from 'path'
import webpack from 'webpack'
import DotEnv from 'dotenv-webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration } from 'webpack-dev-server'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { WhatSrcServerWebpackPlugin } from '@what-src/plugin'

const config: webpack.Configuration & Configuration = {
  mode: 'development',
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, '..', 'public'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-runtime',
              ['module:@what-src/plugin', {
                productionMode: true,
                useRemote: true,
                enableXkcdMode: true,
              }],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new DotEnv({ safe: true }),
    new WhatSrcServerWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      favicon: './static/favicon.ico',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG: false,
    }),
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    contentBase: path.join(__dirname, '..', 'public'),
    compress: true,
    port: 9000,
    overlay: true,
    open: true,
    after: () => {
      require('../scripts/print-console-logo')
    },
  },
  devtool: 'eval-source-map',
}

export default config
