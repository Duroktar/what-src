import path from 'path'
import webpack from 'webpack'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyPlugin from 'copy-webpack-plugin'
import { Configuration } from 'webpack-dev-server'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { WhatSrcServerWebpackPlugin } from '@what-src/plugin'

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
              'module:@what-src/plugin',
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true, // webpack@2.x and newer
            },
          },
        ],
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
    writeToDisk: true,
  },
}

export default config
