import { toCamelCase, isNullOrUndefined, λIf } from '@what-src/utils'
import { defaultOptions } from './options'
import * as GIT from './git'
import * as T from './types'
import { STATS_URL } from './constants'

/**
 * returns any default options merged with all passed plugin options
 *
 * @param {T.WhatSrcPluginOptions} options
 * @param {*} [defaults=defaultOptions]
 * @returns {T.WhatSrcPluginOptions}
 */
export const mergePluginOptions = (
  options: T.WhatSrcPluginOptions,
  defaults = defaultOptions
): T.WhatSrcConfiguration => {
  return { ...defaults, ...options }
}

/**
 * stateful utility function for resolving file urls to their git remote
 * counterparts.
 *
 * > TODO: This should be replaced with
 * >   [hosted-git-info](https://www.npmjs.com/package/hosted-git-info).
 *
 * @param {string} filepath
 * @returns {string} The resolved git url
 */
export const gitUrlResolver = (() => {
  const remoteUrl = GIT.getGitRemoteOriginUrl()
  const branch = GIT.getGitBranchName()
  return function getRemoteFileUrl(filepath: string) {
    const relativeFileUrl = GIT.getGitFileFullName(filepath)
    const options = { branch, filepath: relativeFileUrl }
    return generateGitFileUrl(remoteUrl, options)
  }
})()

/**
 * resolves the github url for the current filename when the useRemote option is
 * set
 *
 * @param {string} filename
 * @param {T.WhatSrcConfiguration} options
 * @param {(str: string) => string} resolver
 */
export const getRemoteFilenameIfSet = (
  filename: string,
  options: T.WhatSrcConfiguration
) => options.useRemote ? gitUrlResolver(filename) : filename

/**
 * generates the github url for the current git branch and filepath
 *
 * @param {string} remoteUrl
 * @param {{
 *   branch: string;
 *   filepath: string;
 * }} opts
 * @returns A valid git resource url. Throws an error otherwise.
 */
export const generateGitFileUrl = (remoteUrl: string, opts: {
  branch: string;
  filepath: string;
}) => {
  if (isNullOrUndefined(remoteUrl) || !remoteUrl.trim().endsWith('.git')) {
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
 * @param {T.WhatSrcConfiguration} options
 * @param {({ [key: string]: string | undefined })} cache
 * @returns
 */
export const generateClickHandlerRawString = (
  options: T.WhatSrcConfiguration,
  cache: { [key: string]: string | undefined }
) => {
  return ((o = {
    ...options,
    dataTag: parseDataTag(options.dataTag),
    whatSrcStatsUrl: process.env.STATS_URL || STATS_URL,
  }) => `
    const __whatSrcCallback01101011 = (() => {
      try {
        const cache = (${JSON.stringify(cache, null, 3)})
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
      } catch {
        return false
      }
    })();

    export default __whatSrcCallback01101011
  `)()
}

/**
 * generates the relevant metadata object
 *
 * @param {meta} {
 *   col,
 *   filename,
 *   line,
 * }
 * @returns
 */
export const generateJsxMetaData = (location: T.SourceLocationFullStart) => {
  const { col, filename, line } = location
  return {
    filename: filename,
    line: line,
    column: col,
    remoteUrl: `${filename}#L${line}`,
  }
}
