import * as traverse from '@babel/traverse'
import * as t from '@babel/types'
import * as WS from '@what-src/plugin-core'
import { isNullOrUndefined, isNodeEnvProduction, getIn, withHooks } from '@what-src/utils'
import { join, resolve } from 'path'
import { buildRequire } from './templates'
import { BabelVisitor } from './types'

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
   * full set of what-src configuration options
   *
   * @type {WS.WhatSrcConfiguration}
   * @memberof WhatSrcBabelPlugin
   */
  public options: WS.WhatSrcConfiguration
  /**
   * instance if @what-src/core `WhatSrcService`
   *
   * @type {WS.WhatSrcService}
   * @memberof WhatSrcBabelPlugin
   */
  public service: WS.WhatSrcService
  /**
   * disabled flag used for bypassing the plugin
   *
   * @type {boolean}
   * @memberof WhatSrcBabelPlugin
   */
  public disabled: boolean = false

  /**
   * creates an instance of the WhatSrcBabelPlugin
   *
   * @param {WS.WhatSrcPluginOptions} defaultOptions
   * @param {string} [basedir='']
   * @param {string} [cache={ __basedir: '' }]
   * @param {boolean} [disabled=false]
   * @memberof WhatSrcBabelPlugin
   */
  constructor(
    public defaultOptions: WS.WhatSrcPluginOptions,
    public basedir: string = '',
    public cache: WS.SourceCache = { __basedir: '' }
  ) {
    this.options = WS.mergePluginOptions(defaultOptions)
    this.service = WS.getService(this)

    if (this.shouldPrintProductionWarning) {
      console.log(
        '@what-src/babel-plugin - running in production mode is disabled. ' +
        'To enable set the "productionMode" configuration option to true.',
      )
      this.disabled = true
    };
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
            const cacheFilePath = this.getFullCacheFilePath(resolve(''))

            const entrance = () => buildRequire({
              importName: t.identifier(this.options.importName),
              cacheFilePath: t.stringLiteral(cacheFilePath),
            })

            const ast = withHooks(entrance, {
              after: () => this.service.emit(cacheFilePath),
            }).result as t.Statement

            path.node.body = [ast, ...path.node.body]
          }
        },
      },
      JSXElement: {
        enter: (path, state): void => {
          // visit every opening jsx element that isn't a fragment
          if (this.disabled || this.isFragment(path.node.openingElement)) return

          // don't visit blacklisted nodes
          const tagname = this.getOpeningElementTagName(path.node)
          if (
            isNullOrUndefined(path.node.openingElement.loc)
            || this.service.tagIsBlacklisted(tagname)
          ) return

          // gather the necessary metadata. we need a location and unique id
          const start = this.getOpeningElementStartLocation(path)
          const location = new WS.SourceLocationBuilder()
            .withBasedir(this.basedir)
            .withCol(start.column + 1)
            .withLine(start.line)
            .build()

          const nextId = this.service.cache(location, state.filename)

          // create the data attribute
          const newAttribute = t.jsxAttribute(
            t.jsxIdentifier(this.options.dataTag),
            t.stringLiteral(nextId)
          )

          // push the new attribute onto the existing list
          path.node.openingElement.attributes.push(newAttribute)
        },
      },
    }
  }

  /**
   * NodePath "OpeningElementStartLocation" path selector
   *
   * @private
   * @param {traverse.NodePath<t.JSXElement>} path
   * @returns `{ line: number, column: number }`
   * @memberof WhatSrcBabelPlugin
   */
  private getOpeningElementStartLocation(path: traverse.NodePath<t.JSXElement>) {
    type SourceLocationStart = { line: number; column: number }
    return getIn('node.openingElement.loc.start', path) as SourceLocationStart
  }

  /**
   * get normalized full path to the cache file
   *
   * @private
   * @param {(string)} outDir
   * @returns
   * @memberof WhatSrcTsTransformer
   */
  private getFullCacheFilePath(outDir: string) {
    return join(outDir, 'dist', this.options.importFrom)
  }

  /**
   * checks the NODE_ENV state against the set production MODE to determine if
   * we should print a warning or not
   *
   * @readonly
   * @private
   * @memberof WhatSrcBabelPlugin
   */
  private get shouldPrintProductionWarning() {
    return !this.disabled && (isNodeEnvProduction() && !this.options.productionMode)
  }

  /**
   * helper function to get the name of the opening jsx element for a node
   *
   * @private
   * @param {t.JSXElement} node
   * @returns
   * @memberof WhatSrcBabelPlugin
   */
  private getOpeningElementTagName(node: t.JSXElement) {
    return (node.openingElement.name as t.JSXIdentifier).name
  }

  /**
   * used to determine if an openingElement is a React.Fragment
   *
   * @param {JSXOpeningElement} openingElement
   * @returns
   */
  private isFragment(openingElement: t.JSXOpeningElement) {
    return getIn('name.property.name', openingElement) === 'Fragment'
  }
}
