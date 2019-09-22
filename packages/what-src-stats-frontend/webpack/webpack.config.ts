import { config as dotenvConfig } from 'dotenv'
import path from 'path'
import webpack from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { Configuration } from 'webpack-dev-server'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { WhatSrcServerWebpackPlugin } from '@what-src/plugin'
dotenvConfig()

const config: webpack.Configuration & Configuration = {
  mode: 'development',
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, '..', 'public'),
    filename: 'bundle.js',
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CopyPlugin([
      { from: 'static', to: 'static' },
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        WEBSITE_URL: JSON.stringify(process.env.WEBSITE_URL),
        CLICK_API_URL: JSON.stringify(process.env.CLICK_API_URL),
      },
    }),
    new WhatSrcServerWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
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
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '..', 'public'),
    compress: true,
    port: 9000,
    overlay: true,
    after: () => {
      require('../scripts/print-console-logo')
    },
  },
}

export default config
