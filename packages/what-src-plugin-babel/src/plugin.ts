import { isNullOrUndefined, isNodeEnvProduction, getIn } from '@what-src/utils'
import * as H from '@what-src/plugin-core'
import template from '@babel/template'
import { join, resolve } from 'path'
import * as T from './types'

let disabled = false
let resolver: ReturnType<typeof H.getResolver> = null as any
let cacheFile: string = ''
let importName: string = ''
const buildRequire = template(`
  var %%importName%% = require(%%cacheFilePath%%);
`)

export const babelPlugin = ({ types: t, ...rest }: T.BabelPluginContext): T.BabelPlugin => ({
  pre(): void {
    const options = H.getAllPluginOptions(this.opts)

    if (!disabled && (isNodeEnvProduction() && !options.productionMode)) {
      console.log(
        '@what-src/babel-plugin - running in production mode is disabled. ' +
        'To enable set the "productionMode" configuration option to true.',
      )
      disabled = true
    };

    this.cache = {}
    this.options = options

    cacheFile = options.importFrom || 'what-src-cache.jss'
    importName = options.importName || '__WhatSrcGlobalVariable'

    if (!resolver) { resolver = H.getResolver({ options: this.options, basedir: '', cache: this.cache }) }
  },
  visitor: {
    Program: {
      exit(path) {
        if (!disabled) {
          const cacheFilePath = join(resolve(''), 'dist', cacheFile)

          const ast = buildRequire({
            importName: t.identifier(importName),
            cacheFilePath: t.stringLiteral(cacheFilePath),
          })

          resolver.emit(cacheFilePath)
          path.node.body = [ast as any, ...path.node.body]
        }
      },
    },
    JSXElement: {
      enter(path, state): void {
        if (disabled || H.isFragment(path.node.openingElement)) return
        if (isNullOrUndefined(path.node.openingElement.loc)) return

        const options = H.getAllPluginOptions(state.options)
        const { column: col, line } = getIn('node.openingElement.loc.start', path)

        const nextId = resolver.resolve({ col, line, basedir: '' }, state.filename)

        path.node.openingElement.attributes.push(t.jsxAttribute(
          t.jsxIdentifier(options.dataTag),
          t.stringLiteral(nextId)
        ))
      },
    },
  },
})
