import * as T from './types'

export const defaultOptions: Required<T.WhatSrcPluginOptions> = {
  serverUrl: 'http://localhost:8018/__what_src',
  dataTag: 'data-what-src',
  productionMode: false,
  stopPropagation: true,
  preventDefault: true,
  globalCacheKey: '__what-src-global-callback-key',
  useRemote: false,
  enableXkcdMode: false,
  whatSrcStatsUrl: 'https://webhooks.mongodb-stitch.com/api/client/v2.0/app/triggers_stitchapp-hnsgo/service/click-service/incoming_webhook/track-click',
}
