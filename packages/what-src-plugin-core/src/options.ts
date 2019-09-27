import * as T from './types'

export const defaultOptions: Required<T.WhatSrcPluginOptions> = {
  dataTag: 'data-what-src',
  enableXkcdMode: false,
  globalCacheKey: '__what-src-global-callback-key',
  importFrom: 'what-src-cache.jss',
  importName: '__WhatSrcGlobalVariable',
  preventDefault: true,
  productionMode: false,
  serverUrl: 'http://localhost:8018/__what_src',
  stopPropagation: true,
  useRemote: false,
}
