import { JSXOpeningElement } from '@babel/types'
import { toCamelCase, getIn, isNullOrUndefined, λIf } from '@what-src/utils'
import { defaultOptions } from './options'
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
 * @param {Required<T.WhatSrcPluginOptions>} options
 * @param {({ [key: string]: string | undefined })} cache
 * @returns
 */
export const generateClickHandlerRawString = (
  options: Required<T.WhatSrcPluginOptions>,
  cache: { [key: string]: string | undefined }
) => {
  return ((o = {
    productionMode: options.productionMode,
    globalCacheKey: options.globalCacheKey,
    serverUrl: options.serverUrl,
    dataTag: parseDataTag(options.dataTag),
    stopPropagation: options.stopPropagation,
    preventDefault: options.preventDefault,
    useRemote: options.useRemote,
    enableXkcdMode: options.enableXkcdMode,
    whatSrcStatsUrl: options.whatSrcStatsUrl,
  }) => `
    const __whatSrcCallback01101011 = (() => {
      try {
        const cache = (${JSON.stringify(cache, null, 3)});
        window["${o.globalCacheKey}"] = function (e) {
          if (e.metaKey) {
            const tag = cache[e.path[0].dataset["${o.dataTag}"]];
            if (tag === undefined) throw new Error('Scott.. Ite derped again.');
            const dataset = JSON.parse(tag);
            ${λIf(o.stopPropagation, 'e.stopPropagation();', '')}
            ${λIf(o.preventDefault, 'e.preventDefault();', '')}
            if (typeof dataset === 'undefined') return;
            ${λIf(o.useRemote, {
              value: 'window.open(dataset.remoteUrl, "_blank");',
              otherwise: `
                const xhr = new XMLHttpRequest();
                xhr.open('POST', "${o.serverUrl}", true);
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.send(JSON.stringify({ ...dataset, basedir: cache.__basedir }));
              `,
            })}
            ${λIf(o.enableXkcdMode, `
                const xhr = new XMLHttpRequest();
                xhr.open('POST', "${o.whatSrcStatsUrl}", true);
                xhr.send();
              `, '')}
          }
        }
        window.document.removeEventListener('click', window["${o.globalCacheKey}"])
        window.document.addEventListener('click', window["${o.globalCacheKey}"])
        return true
      } catch (e) {
        return false
      }
    })();

    export default __whatSrcCallback01101011
  `)()
}

type generateJsxMetaDataArgs = {
  filename: string,
  line: number,
  col: number,
}

/**
 * generates the relevant metadata object
 *
 * @param {meta} {
 *   filename,
 *   line,
 *   col,
 * }
 * @returns
 */
export const generateJsxMetaData = (meta: generateJsxMetaDataArgs) => {
  const { col, filename, line } = meta
  const metaData = {
    filename: filename,
    line: line,
    column: col + 1,
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
