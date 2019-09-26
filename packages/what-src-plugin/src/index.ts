import babelPlugin from '@what-src/babel-plugin'
import { whatSrcClickHandler } from '@what-src/plugin-core'
import WhatSrcServerWebpackPlugin from '@what-src/webpack-plugin'
import WhatSrcServerTsLoaderPlugin from '@what-src/typescript-plugin'

export default babelPlugin
export { WhatSrcServerWebpackPlugin, WhatSrcServerTsLoaderPlugin, whatSrcClickHandler }
