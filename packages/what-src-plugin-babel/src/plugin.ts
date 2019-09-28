import * as traverse from '@babel/traverse'
import * as t from '@babel/types'
import * as WS from '@what-src/plugin-core'
import { isNullOrUndefined, isNodeEnvProduction, getIn } from '@what-src/utils'
import { join, resolve } from 'path'
import { buildRequire } from './templates'

type BabelVisitor = { visitor: traverse.Visitor<WS.VisitorState> }

/**
 * create a new what-src babel-compiler plugin.
 *
 * @param {WS.BabelPluginContext} { types, ...rest }
 * @returns {BabelVisitor}
 */
export const getBabelPlugin = ({ types, ...rest }: WS.BabelPluginContext): BabelVisitor => {
  return { visitor: new WhatSrcBabelPlugin({}).visitor() }
}

/**
 * @what-src/babel-plugin controller class
 *
 * @class WhatSrcBabelPlugin
 */
class WhatSrcBabelPlugin {
  /**
   *
   *
   * @type {WS.WhatSrcConfiguration}
   * @memberof WhatSrcBabelPlugin
   */
  public options: WS.WhatSrcConfiguration

  /**
   *
   *
   * @type {WS.WhatSrcService}
   * @memberof WhatSrcBabelPlugin
   */
  public service: WS.WhatSrcService

  /**
   * creates an instance of the WhatSrcBabelPlugin
   * @param {WS.WhatSrcPluginOptions} defaultOpts
   * @param {string} [basedir='']
   * @param {string} [cache={ __basedir: '' }]
   * @param {boolean} [disabled=false]
   * @memberof WhatSrcBabelPlugin
   */
  constructor(
    public defaultOpts: WS.WhatSrcPluginOptions,
    public basedir: string = '',
    public cache: WS.SourceCache = { __basedir: '' },
    public disabled: boolean = false,
  ) {
    this.options = WS.mergePluginOptions(defaultOpts)

    if (this.shouldPrintProductionWarning) {
      console.log(
        '@what-src/babel-plugin - running in production mode is disabled. ' +
        'To enable set the "productionMode" configuration option to true.',
      )
      this.disabled = true
    };

    this.service = WS.getService(this)
  }

  /**
   * typescript node ast visitor
   *
   * @memberof WhatSrcBabelPlugin
   */
  public visitor = (): traverse.Visitor<WS.VisitorState> => {
    return {
      Program: {
        exit: (path) => {
          if (!this.disabled) {
            // at the very end we write out our cache file and append an import to it
            // to be used for starting the click listener in the comsumers client
            const cacheFilePath = join(resolve(''), 'dist', this.options.importFrom)

            const ast = buildRequire({
              importName: t.identifier(this.options.importName),
              cacheFilePath: t.stringLiteral(cacheFilePath),
            })

            this.service.emit(cacheFilePath)
            path.node.body = [ast as any, ...path.node.body]
          }
        },
      },
      JSXElement: {
        enter: (path, state): void => {
          // tag every opening jsx element that isn't a fragment, and isnot in
          // the blacklist /// TODO: !!!
          if (this.disabled || WS.isFragment(path.node.openingElement)) return
          if (isNullOrUndefined(path.node.openingElement.loc)) return

          const { column: col, line } = this.getOpeningElementStartLocation(path)

          const payload = { col, line, basedir: '' }
          const nextId = this.service.cache(payload, state.filename)

          path.node.openingElement.attributes.push(t.jsxAttribute(
            t.jsxIdentifier(this.options.dataTag),
            t.stringLiteral(nextId)
          ))
        },
      },
    }
  }

  /**
   * helper function for checking an "OpeningElementStartLocation" path
   *
   * @private
   * @param {traverse.NodePath<t.JSXElement>} path
   * @returns
   * @memberof WhatSrcBabelPlugin
   */
  private getOpeningElementStartLocation(path: traverse.NodePath<t.JSXElement>) {
    return getIn('node.openingElement.loc.start', path)
  }

  /**
   * helper function for checking the NODE_ENV state
   *
   * @readonly
   * @private
   * @memberof WhatSrcBabelPlugin
   */
  private get shouldPrintProductionWarning() {
    return !this.disabled && (isNodeEnvProduction() && !this.options.productionMode)
  }
}
