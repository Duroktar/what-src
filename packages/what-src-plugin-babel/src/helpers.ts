import template from '@babel/template'
import { JSXOpeningElement, JSXElement } from '@babel/types'
import { NodePath } from '@babel/traverse'
import { defaultOptions } from './options'
import { toCamelCase, getIn, isNullOrUndefined } from './utils'
import * as GIT from './git'
import * as T from './types'

/**
 * returns any default options merged with all passed plugin options
 *
 * @param {T.WhatSrcPluginOptions} options
 * @param {*} [defaults=defaultOptions]
 * @returns {Required<T.WhatSrcPluginOptions>}
 */
export const getAllPluginOptions = (
  options: T.WhatSrcPluginOptions,
  defaults = defaultOptions,
): Required<T.WhatSrcPluginOptions> => {
  return { ...defaults, ...options }
}

/**
 * utility function for resolving file urls to their git remote
 * counterparts.
 */
export const gitUrlResolver = (() => {
  const remoteUrl = GIT.getGitRemoteUrl()
  const branch = GIT.getGitBranchName()
  return function getRemoteFileUrl(filepath: string) {
    const relativeFileUrl = GIT.getRelativeGitFileUrl(filepath)
    const options = { branch, filepath: relativeFileUrl }
    return generateGitFileUrl(remoteUrl, options)
  }
})()

/**
 * resolves the github url for the current filename when the useRemote option is
 * set
 *
 * @param {string} filename
 * @param {Required<T.WhatSrcPluginOptions>} options
 * @param {(str: string) => string} resolver
 */
export const getRemoteFilenameIfSet = (
  filename: string,
  options: Required<T.WhatSrcPluginOptions>,
) => options.useRemote ? gitUrlResolver(filename) : filename

/**
 * generates the github url for the current git branch and filepath
 *
 * @param {string} remoteUrl
 * @param {{
 *   branch: string;
 *   filepath: string;
 * }} opts
 * @returns
 */
export const generateGitFileUrl = (remoteUrl: string, opts: {
  branch: string;
  filepath: string;
}) => {
  if (isNullOrUndefined(remoteUrl) || !remoteUrl.endsWith('.git')) {
    throw new Error(`${remoteUrl} is not a valid remote url.`)
  }
  return `${remoteUrl.slice(0, -4)}/blob/${opts.branch}/${opts.filepath}`
}

/**
 * returns the generated prperty name for a data attribute string
 *
 * @param {string} spinalName
 * @returns
 */
export const parseDataTag = (spinalName: string) => {
  return toCamelCase(spinalName.slice('data-'.length))
}

/**
 * generate the ast for the main clickhandler
 *
 * @param {T.BabelPluginContext['types']} t
 * @param {Required<T.WhatSrcPluginOptions>} options
 * @param {({ [key: string]: string | undefined })} cache
 * @returns
 */
export const generateClickHandlerAst = (
  t: T.BabelPluginContext['types'],
  options: Required<T.WhatSrcPluginOptions>,
  cache: { [key: string]: string | undefined }
) => {
  return clickHandlerBuilder({
    globalCacheKey: t.stringLiteral(options.globalCacheKey),
    serverUrl: t.stringLiteral(options.serverUrl),
    cache: t.stringLiteral(JSON.stringify(cache)),
    dataTag: t.stringLiteral(parseDataTag(options.dataTag)),
    stopPropagation: t.booleanLiteral(options.stopPropagation),
    preventDefault: t.booleanLiteral(options.preventDefault),
    useRemote: t.booleanLiteral(options.useRemote),
  })
}

const clickHandlerBuilder = template.statement(`
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

/**
 * generate an ast for the configured data attribute tag
 *
 * @param {T.BabelPluginContext['types']} t
 * @param {Required<T.WhatSrcPluginOptions>} options
 * @param {string} nextId
 * @returns
 */
export const generateAttribute = (
  t: T.BabelPluginContext['types'],
  options: Required<T.WhatSrcPluginOptions>,
  nextId: string
) => {
  return t.jsxAttribute(
    t.jsxIdentifier(options.dataTag),
    t.stringLiteral(nextId)
  )
}

/**
 * generates the metadata object for a given nodepath
 *
 * @param {NodePath<JSXElement>} path
 * @param {string} filename
 * @returns
 */
export const generateJsxMetaData = (
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

/**
 * used to determine if an openingElement is a React.Fragment
 *
 * @param {JSXOpeningElement} openingElement
 * @returns
 */
export const isFragment = (openingElement: JSXOpeningElement) => {
  return getIn('name.property.name', openingElement) === 'Fragment'
}
