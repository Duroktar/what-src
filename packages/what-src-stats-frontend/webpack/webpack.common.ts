import webpack from 'webpack'
import DotEnv from 'dotenv-webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration } from 'webpack-dev-server'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
// import { WhatSrcServerWebpackPlugin } from '@what-src/plugin'
// import { WhatSrcPluginOptions } from '@what-src/plugin-core/dist'

const config: webpack.Configuration & Configuration = {
  entry: './src/main.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
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
    // new WhatSrcServerWebpackPlugin(), // !!! Not needed when `useRemote === true`
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
}

export default config
