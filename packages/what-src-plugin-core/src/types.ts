
/**
 * Model for available service options. All optional.
 *
 * `{ filename: 'some/filename.ts', remoteFn: null }`
 */
export type ServiceOptions = {

  /**
   * Standard plugin options object.
   *
   * @type {WhatSrcPluginOptions}
   */
  options?: WhatSrcPluginOptions;

  /**
   * The base directory to resolve cache items from.
   *
   * @type {string}
   */
  basedir?: string;

  /**
   * A custom cache object (usefull for testing).
   *
   * @type {{}}
   */
  cache?: {};
}

/**
 * Model for source text line and column data.
 *
 * `{ filename: 'some/filename.ts', remoteFn: null }`
 */
export type SourceLocationStart = {

  /**
   * The source column location.
   *
   * @type {number}
   */
  column: number;

  /**
   * The source line location.
   *
   * @type {number}
   */
  line: number;
}

/**
 * Model for source text line and column data with filename.
 *
 * `{ filename: 'some/filename.ts', remoteFn: null }`
 */
export type SourceLocationFullStart = {

  /**
   * The source locations filename.
   *
   * @type {string}
   */
  filename: string;
} & SourceLocationStart

/**
 * A local source DTO has a filename only.
 *
 * `{ filename: 'some/filename.ts', remoteFn: null }`
 */
type LocalSourceDTO = { filename: string; remoteFn: null }

/**
 * A remote source DTO has a remoteFn only.
 *
 * `{ remoteFn: 'some/filename.ts#L29', filename: null }`
 */
type RemoteSourceDTO = { filename: null; remoteFn: string }

/**
 * Union of the different source DTO types with location data.
 */
export type SourceLocationDTO =
  & (LocalSourceDTO | RemoteSourceDTO)
  & SourceLocationStart

/**
 * Keys are sequential numbers (cooerced to strings due to how js object keys
 * are stored) corresponding to some element in the dom with a matching tag. The
 * key value is the relative url to the file, line, and column as determined by
 * the visitor. The basedir for the relatively located url values are kept in
 * the __basedir property of the cache and should be sent along with the dto to
 * the backend when a click event is dispatched.
 *
 */
export type WhatSrcCache = {
  [key: string]: string;

  /**
   * The root directory that will be appended to the start of all line entry
   * `filename` and `remoteFn` properties to resolve the full path. This helps
   * keep the cache file more normalized and --as a result-- smaller.
   *
   * @type {string}
   */
  __basedir: string;
}

/**
 * Runtime `WhatSrcPluginOptions` configuration.
 *
 * @type {Required<WhatSrcPluginOptions>}
 */
export type WhatSrcConfiguration = Required<WhatSrcPluginOptions>

/**
 * Overridable collection of plugin options.
 *
 * @type {WhatSrcPluginOptions}
 */
export type WhatSrcPluginOptions = {
  /**
   * The data attribute value used on tagged elements.
   *
   * @type {string}
   */
  dataTag?: string;

  /**
   * Enable usage tracking for webapp.
   *
   * @type {boolean}
   */
  enableXkcdMode?: boolean;

  /**
   * `window` property too inject the global click handler callback.
   *
   * @type {string}
   */
  globalCacheKey?: string;

  /**
   * Basename of the runtime/cache file.
   *
   * @type {string}
   */
  cacheFileName?: string;

  /**
   * Toggles the calling of this event in the global click handler.
   *
   * @type {boolean}
   */
  preventDefault?: boolean;

  /**
   * Toggles the calling of this event in the global click handler.
   *
   * @type {boolean}
   */
  stopPropagation?: boolean;

  /**
   * Must be set to enable the plugin in productino mode.
   *
   * @type {boolean}
   */
  productionMode?: boolean;

  /**
   * url of the @what-src/express server or equivalent.
   *
   * @type {string}
   */
  serverUrl?: string;

  /**
   * When enabled opens the clicked elements source code on github.
   *
   * @type {boolean}
   */
  useRemote?: boolean;

  /**
   * Blacklisted tags are ignored by the visitor.
   *
   * @type {string[]}
   */
  blacklistedTags?: string[];

  /**
   * Overrides an internal cache location variable (used for CI purposes)
   *
   * @type {(null | string)}
   */
  cacheLocOverride?: null | string;

  /**
   * Override the basedir setting for the cache (used for CI purposes)
   *
   * @type {(null | string)}
   */
  baseDirOverride?: null | string;

  /**
   * When false, skips creating missing folders to the cache location.
   * (used mostly for testing and CI)
   *
   * @type {boolean}
   */
  createCacheDir?: boolean

  /**
   * When false, skips the actual writing of the cache file to disk.
   * (used mostly for testing and CI)
   *
   * @type {boolean}
   */
  createCacheFile?: boolean
}
