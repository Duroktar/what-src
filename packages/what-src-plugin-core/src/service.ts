import * as ts from 'typescript'
import { withHooks } from '@what-src/utils'
import { defaultOptions, defaultCache } from './options'
import * as H from './helpers'
import * as T from './types'

/**
 * create a new what-src service instance
 *
 * @param {"WhatSrcService"} { options, basedir, cache = defaultCache }
 * @returns new what-src service instance
 */
export const getService = ({ options, ...args }: T.ServiceOptions = {}) => {
  return new WhatSrcService(options, args.basedir, args.cache)
}

export class WhatSrcService {
  /**
   * full set of what-src configuration options
   *
   * @type {WS.WhatSrcConfiguration}
   * @memberof WhatSrcBabelPlugin
   */
  public options: T.WhatSrcConfiguration

  /**
   * incrementing value used for element tags
   *
   * @private
   * @type {number}
   * @memberof Resolver
   */
  private nextId: number = 1

  /**
   * list of element tag names to ignore
   *
   * @private
   * @type {Set<string>}
   * @memberof WhatSrcService
   */
  private blockedTags!: Set<string>

  /**
   * the cache *theme song plays
   *
   * @private
   * @type {T.SourceCache}
   * @memberof WhatSrcService
   */
  private _cache!: T.SourceCache

  constructor(
    options: T.WhatSrcPluginOptions = {},
    basedir: string = '',
    cache: {} = {}
  ) {
    this.options = H.mergePluginOptions(options, defaultOptions)
    this.blockedTags = new Set(this.options.blacklistedTags)
    this._cache = { ...defaultCache, ...cache, __basedir: basedir }
  }

  /**
   * Compile and emit the cache file to the provided location.
   *
   * @memberof WhatSrcService
   */
  public emit = (location: string) => {
    const source = H.generateClickHandlerRawString(this.options, this._cache)

    const result = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    })

    const host = ts.createCompilerHost(this.options)
    host.writeFile(location, result.outputText, false)
  }

  /**
   * cache a given source file location. returns the items unique cache key.
   *
   * @memberof WhatSrcService
   */
  public cache = (loc: T.SourceLocationStart, sourcefile: string) => {
    const remoteFn = H.getRemoteFilenameIfSet(sourcefile, this.options)
    const filename = remoteFn.replace(this._cache.__basedir, '')
    const metaData = H.generateJsxMetaData({ ...loc, filename })

    return withHooks(() => this.nextId.toString(), {
      after: () => this.setCache(JSON.stringify(metaData)),
    }).result
  }

  /**
   * returns the source file location cache
   *
   * @memberof WhatSrcService
   */
  public getSourceCache = () => {
    return this._cache
  }

  /**
   * ignore any explicitly blacklisted tags. the blacklist is converted to a set
   * during class construction to be used for fast lookups
   *
   * @private
   * @param {ts.JsxElement} node
   * @returns
   * @memberof WhatSrcTsTransformer
   */
  public tagIsBlacklisted(tagname: string) {
    return this.blockedTags.has(tagname)
  }

  /**
   *  sets the next cache value then increments the key
   *
   * @private
   * @memberof WhatSrcService
   */
  private setCache = (metaData: string) => {
    this._cache[this.nextId++] = metaData
  }
}
