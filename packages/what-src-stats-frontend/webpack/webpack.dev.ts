import merge from 'webpack-merge'
import path from 'path'
import base from './webpack.common'

export default merge(base, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '..', 'public'),
    filename: '[name].bundle.js',
  },
  devtool: 'eval-source-map',
  devServer: {
    contentBase: path.join(__dirname, '..', 'public'),
    compress: true,
    port: 9000,
    overlay: true,
  },
})
