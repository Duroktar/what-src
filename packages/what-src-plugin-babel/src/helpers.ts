import template from '@babel/template'
import { JSXOpeningElement, JSXElement } from '@babel/types'
import { NodePath } from '@babel/traverse'
import { defaultOptions } from './options'
import { toCamelCase, getIn } from './utils'
import * as T from './types'

export const getAllPluginOptions = (
  state: T.VisitorState,
  defaults = defaultOptions,
): Required<T.WhatSrcPluginOptions> => {
  return { ...defaults, ...state.opts }
}

export const clickHandlerBuilder = template.statement(`
  try {
    const cache = JSON.parse(%%cache%%)
    window[%%globalCacheKey%%] = function (e) {
      if (e.metaKey) {
        if (%%stopPropagation%%) e.stopPropagation()
        if (%%preventDefault%%) e.preventDefault()
        const xhr = new XMLHttpRequest()
        xhr.open('POST', %%serverUrl%%, true)
        xhr.setRequestHeader('Content-type', 'application/json')
        const dataset = cache[e.path[0].dataset[%%dataTag%%]]
        if (typeof dataset !== 'undefined') xhr.send(dataset)
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
  state: T.VisitorState,
) => {
  const meta = getIn('node.openingElement.loc.start', path)
  const metaData = JSON.stringify({
    filename: state.filename,
    line: meta.line,
    column: meta.column + 1,
  })
  return metaData
}

export const isFragment = (openingElement: JSXOpeningElement) => {
  return getIn('name.property.name', openingElement) === 'Fragment'
}
