import template from '@babel/template'
import { JSXOpeningElement, JSXElement } from '@babel/types'
import { NodePath } from '@babel/traverse'
import { defaultOptions } from './options'
import { toCamelCase, getIn } from './utils'
import * as T from './types'

export const getAllPluginOptions = (
  options: T.WhatSrcPluginOptions,
  defaults = defaultOptions,
): Required<T.WhatSrcPluginOptions> => {
  return { ...defaults, ...options }
}

export const getRemoteFilenameIfSet = (
  filename: string,
  options: Required<T.WhatSrcPluginOptions>,
  resolver: (str: string) => string,
) => options.useRemote ? resolver(filename) : filename

export const clickHandlerBuilder = template.statement(`
  try {
    const cache = JSON.parse(%%cache%%)
    window[%%globalCacheKey%%] = function (e) {
      if (e.metaKey) {
        const dataset = cache[e.path[0].dataset[%%dataTag%%]]
        if (%%stopPropagation%%) e.stopPropagation()
        if (%%preventDefault%%) e.preventDefault()
        if (typeof dataset === 'undefined') return
        if (%%useRemote%%) {
          const {remoteUrl} = JSON.parse(dataset)
          console.log('Opening', remoteUrl, 'in browser tab')
          return window.open(remoteUrl, '_blank')
        }
        const xhr = new XMLHttpRequest()
        xhr.open('POST', %%serverUrl%%, true)
        xhr.setRequestHeader('Content-type', 'application/json')
        xhr.send(dataset)
      }
    }
    window.document.removeEventListener('click', window[%%globalCacheKey%%])
    window.document.addEventListener('click', window[%%globalCacheKey%%])
  } catch {}
`)

export const parseDataTag = (spinalName: string) => {
  return toCamelCase(spinalName.slice('data-'.length))
}

export const parseJsxMetaData = (
  path: NodePath<JSXElement>,
  filename: string,
) => {
  const meta = getIn('node.openingElement.loc.start', path)
  const metaData = {
    filename: filename,
    line: meta.line,
    column: meta.column + 1,
    remoteUrl: '',
  }
  metaData.remoteUrl =
    `${filename}#L${metaData.line}`
  return metaData
}

export const isFragment = (openingElement: JSXOpeningElement) => {
  return getIn('name.property.name', openingElement) === 'Fragment'
}
