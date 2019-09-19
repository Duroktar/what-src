import template from '@babel/template'
import { isNullOrUndefined, getIn } from './utils'
import { defaultOptions } from './options'
import * as T from './types'

let nextId = 1
let disabled = false

export const babelPlugin = ({ types: t }: T.BabelPluginContext): T.BabelPlugin => ({
  pre(): void {
    const opts: Required<T.WhatSrcPluginOptions> = Object.assign({}, defaultOptions, this.opts)

    if (!disabled && process.env.NODE_ENV === 'production' && !opts.productionMode) {
      console.log(
        '@what-src/babel-plugin - running in production mode is disabled. ' +
        'To enable set the \'productionMode\' configuration option to true.'
      )
      disabled = true
    };

    this.cache = {}
  },
  post(state): void {
    if (disabled) return

    const opts: Required<T.WhatSrcPluginOptions> = Object.assign({}, defaultOptions, this.opts)

    const eventListener = template.statement(`
      try {
        const cache = JSON.parse(%%cache%%);
        window[%%globalCacheKey%%] = function (e) {
          if (e.metaKey) {
            if (%%stopPropagation%%) e.stopPropagation()
            if (%%preventDefault%%) e.preventDefault()
            const xhr = new XMLHttpRequest();
            xhr.open('POST', %%serverUrl%%, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            const dataset = cache[e.path[0].dataset['WhatSrc']]
            if (typeof dataset !== 'undefined') xhr.send(dataset);
          }
        }
        window.document.removeEventListener('click', window[%%globalCacheKey%%])
        window.document.addEventListener('click', window[%%globalCacheKey%%])
      } catch {}
    `)

    const rawCache = JSON.stringify(this.cache)

    const ast = eventListener({
      globalCacheKey: t.stringLiteral(opts.globalCacheKey),
      serverUrl: t.stringLiteral(opts.serverUrl),
      cache: t.stringLiteral(rawCache),
      stopPropagation: t.booleanLiteral(opts.stopPropagation),
      preventDefault: t.booleanLiteral(opts.preventDefault),
    })

    state.path.node.body.push(ast)
  },
  visitor: {
    JSXElement: {
      enter(path, state): void {
        const isFragment = getIn('name.property.name', path.node.openingElement) === 'Fragment'
        if (disabled || isFragment || isNullOrUndefined(path.node.openingElement.loc)) return

        const opts: Required<T.WhatSrcPluginOptions> = Object.assign(
          {}, defaultOptions, state.opts)
        const meta = path.node.openingElement.loc.start

        const metaData = JSON.stringify({
          filename: state.filename,
          line:     meta.line,
          column:   meta.column + 1, // don't know why we need the '+ 1' but we do *le shrug
        })

        const attr = t.jsxAttribute(
          t.jsxIdentifier(opts.dataTag),
          t.stringLiteral(nextId.toString()),
        )

        path.node.openingElement.attributes.push(attr)

        this.cache[nextId] = metaData

        nextId++
      },
    },
  },
})
