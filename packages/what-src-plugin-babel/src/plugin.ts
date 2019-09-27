import { JSXElement } from '@babel/types'
import template from '@babel/template'
import * as traverse from '@babel/traverse'
import * as WS from '@what-src/plugin-core'
import { isNullOrUndefined, isNodeEnvProduction, getIn } from '@what-src/utils'
import { join, resolve } from 'path'

const importFrom: string = ''
const importName: string = ''

const buildRequire = template(`
  var %%importName%% = require(%%cacheFilePath%%);
`)

class BabelPluginService {
  public options: WS.WhatSrcOptions
  public resolver: ReturnType<typeof WS.getResolver>

  constructor(
    public defaultOpts: WS.WhatSrcPluginOptions,
    public basedir = '',
    public cache = { __basedir: '' },
    public disabled = false,
  ) {
    this.options = WS.getAllPluginOptions(defaultOpts)

    if (this.shouldPrintProductionWarning) {
      console.log(
        '@what-src/babel-plugin - running in production mode is disabled. ' +
        'To enable set the "productionMode" configuration option to true.',
      )
      this.disabled = true
    };

    this.resolver = WS.getResolver(this)
  }

  private visitor = (t: WS.BabelNodeTypes): traverse.Visitor<WS.VisitorState> => {
    return {
      Program: {
        exit: (path) => {
          if (!this.disabled) {
            const cacheFilePath = join(resolve(''), 'dist', importFrom)

            const ast = buildRequire({
              importName: t.identifier(importName),
              cacheFilePath: t.stringLiteral(cacheFilePath),
            })

            this.resolver.emit(cacheFilePath)
            path.node.body = [ast as any, ...path.node.body]
          }
        },
      },
      JSXElement: {
        enter: (path, state): void => {
          if (this.disabled || WS.isFragment(path.node.openingElement)) return
          if (isNullOrUndefined(path.node.openingElement.loc)) return

          const { column: col, line } = this.getOpeningElementStartLocation(path)

          const payload = { col, line, basedir: '' }
          const nextId = this.resolver.resolve(payload, state.filename)

          path.node.openingElement.attributes.push(t.jsxAttribute(
            t.jsxIdentifier(this.options.dataTag),
            t.stringLiteral(nextId)
          ))
        },
      },
    }
  }

  public getOpeningElementStartLocation(path: traverse.NodePath<JSXElement>) {
    return getIn('node.openingElement.loc.start', path)
  }

  public getPlugin = (t: WS.BabelNodeTypes): WS.BabelPlugin => {
    return { visitor: this.visitor(t) /*, pre: this.pre(t) */ }
  }

  public get shouldPrintProductionWarning() {
    return !this.disabled && (isNodeEnvProduction() && !this.options.productionMode)
  }
}

export const babelPlugin = ({ types: t }: WS.BabelPluginContext) => {
  return new BabelPluginService({}).getPlugin(t)
}
