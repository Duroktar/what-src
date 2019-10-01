import * as T from './types'

export const defaultOptions: Required<T.WhatSrcPluginOptions> = {
  blacklistedTags: ['Helmet', 'head', 'meta', 'script'],
  dataTag: 'data-what-src',
  enableXkcdMode: false,
  productionMode: false,
  useRemote: false,
  preventDefault: true,
  stopPropagation: true,
  serverUrl: 'http://localhost:8018/__what_src',
  globalCacheKey: '__what-src-global-callback-key',
  cacheFileName: 'whatSrcRuntime.js',
  cacheLocOverride: null,
  baseDirOverride: null,
  createCacheDir: true,
  createCacheFile: true,
}

export const defaultCache = { __basedir: '' }
