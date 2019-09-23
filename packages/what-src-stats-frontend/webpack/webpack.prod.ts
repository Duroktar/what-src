import merge from 'webpack-merge'
import TerserPlugin from 'terser-webpack-plugin'
import path from 'path'
import base from './webpack.config'

export default merge(base, {
  mode: 'production',
  output: {
    path: path.join(__dirname, '..', 'public'),
    filename: 'bundle.min.js',
  },
  devtool: false,
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
          compress: true,
        },
      }),
    ],
  },
})
