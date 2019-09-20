import * as T from './types'

export const defaultOptions: Required<T.WhatSrcPluginOptions> = {
  serverUrl: 'http://localhost:8018/__what_src',
  dataTag: 'data-what-src',
  productionMode: false,
  stopPropagation: true,
  preventDefault: true,
  globalCacheKey: '__what-src-global-callback-key',
  useRemote: false,
}
