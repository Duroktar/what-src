import { parseDataTag, isFragment, parseJsxMetaData, getAllPluginOptions, clickHandlerBuilder } from './helpers'
import { isNullOrUndefined, isNodeEnvProduction } from './utils'
import * as T from './types'

let nextId = 1
let disabled = false

export const babelPlugin = ({ types: t }: T.BabelPluginContext): T.BabelPlugin => ({
  pre(): void {
    const opts = getAllPluginOptions(this.opts)

    if (!disabled && (isNodeEnvProduction() && !opts.productionMode)) {
      console.log(
        '@what-src/babel-plugin - running in production mode is disabled. ' +
        'To enable set the \'productionMode\' configuration option to true.'
      )
      disabled = true
    };

    this.cache = {}
  },
  post(state): void {
    if (!disabled) {
      const options = getAllPluginOptions(state)

      const ast = clickHandlerBuilder({
        globalCacheKey: t.stringLiteral(options.globalCacheKey),
        serverUrl: t.stringLiteral(options.serverUrl),
        cache: t.stringLiteral(JSON.stringify(this.cache)),
        dataTag: t.stringLiteral(parseDataTag(options.dataTag)),
        stopPropagation: t.booleanLiteral(options.stopPropagation),
        preventDefault: t.booleanLiteral(options.preventDefault),
      })

      state.path.node.body.push(ast)
    }
  },
  visitor: {
    JSXElement: {
      enter(path, state): void {
        if (disabled || isFragment(path.node.openingElement)) return
        if (isNullOrUndefined(path.node.openingElement.loc)) return

        const options = getAllPluginOptions(state)

        const metaData = parseJsxMetaData(path, state)

        const attr = t.jsxAttribute(
          t.jsxIdentifier(options.dataTag),
          t.stringLiteral(nextId.toString()),
        )

        path.node.openingElement.attributes.push(attr)

        this.cache[nextId] = metaData

        nextId++
      },
    },
  },
})
