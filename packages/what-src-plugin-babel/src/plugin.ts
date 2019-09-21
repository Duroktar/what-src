import { isNullOrUndefined, isNodeEnvProduction } from './utils'
import * as H from './helpers'
import * as T from './types'

let nextId = 1
let disabled = false

export const babelPlugin = ({ types: t }: T.BabelPluginContext): T.BabelPlugin => ({
  pre(): void {
    const opts = H.getAllPluginOptions(this.opts)

    if (!disabled && (isNodeEnvProduction() && !opts.productionMode)) {
      console.log(
        '@what-src/babel-plugin - running in production mode is disabled. ' +
        'To enable set the "productionMode" configuration option to true.',
      )
      disabled = true
    };

    this.cache = {}
  },
  post(state): void {
    if (!disabled) {
      const options = H.getAllPluginOptions(this.opts)
      const ast = H.generateClickHandlerAst(t, options, this.cache)

      state.path.node.body.push(ast)
    }
  },
  visitor: {
    JSXElement: {
      enter(path, state): void {
        if (disabled || H.isFragment(path.node.openingElement)) return
        if (isNullOrUndefined(path.node.openingElement.loc)) return

        const options = H.getAllPluginOptions(state.opts)
        const filename = H.getRemoteFilenameIfSet(state.filename, options)
        const metaData = H.generateJsxMetaData(path, filename)

        const attr = H.generateAttribute(t, options, nextId.toString())

        path.node.openingElement.attributes.push(attr)

        this.cache[nextId] = JSON.stringify(metaData)

        nextId++
      },
    },
  },
})
