import * as ts from 'typescript'
import { join, dirname } from 'path'
import { withHooks, isNullOrUndefined } from '@what-src/utils'
import { defaultOptions, defaultCache } from './options'
import * as H from './helpers'
import * as T from './types'
import { mkdirSync } from 'fs'

/**
 * Factory function for the WhatSrcService class.
 *
 * @param {"WhatSrcService"} { options, basedir, cache = defaultCache }
 * @returns new what-src service instance
 */
export const getService = ({ options, ...args }: T.ServiceOptions = {}) => {
  return new WhatSrcService(options, args.basedir, args.cache)
}

/**
 * The primary @what-src/plugin-core service class.
 *
 * @export
 * @class WhatSrcService
 */
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
   * @type {T.WhatSrcCache}
   * @memberof WhatSrcService
   */
  private _cache!: T.WhatSrcCache

  /**
   * Creates an instance of WhatSrcService.
   *
   * @param {T.WhatSrcPluginOptions} [options={}]
   * @param {string} [basedir='']
   * @param {{}} [cache={}]
   * @memberof WhatSrcService
   */
  constructor(
    options: T.WhatSrcPluginOptions = {},
    basedir: string = '',
    cache: {} = {}
  ) {
    this.options = H.mergePluginOptions(options, defaultOptions)
    this.blockedTags = new Set(this.options.blacklistedTags)
    this._cache = this.initializeCache(basedir, cache)
  }

  /**
   * Initialize the cache with system/user settings and basedir.
   *
   * @private
   * @memberof WhatSrcService
   */
  private initializeCache = (basedir: string, cache: {}) => {
    const __basedir = this.getBaseDirForCache(basedir)
    return { ...defaultCache, ...cache, __basedir }
  }

  /**
   * Compile and emit the cache file to the provided location.
   *
   * @memberof WhatSrcService
   */
  public emit = (location: string) => {
    const source = H.generateClickHandlerRawString(this.options, this._cache)

    // using ts here cause it's got builtin filesystem helpers
    const result = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    })

    // create the necessary caching directories and paths
    const host = ts.createCompilerHost(this.options)
    if (this.options.createCacheDir && !host.directoryExists!(dirname(location))) {
      mkdirSync(dirname(location), { recursive: true })
    }

    // useful mostly for CI but we can skip the actual write part if needed
    if (this.options.createCacheFile) {
      const transpiledSource = H.compileSource(result.outputText)
      host.writeFile(location, transpiledSource, false, errMsg => {
        throw new Error(
          '[@what-src/core] Error writing file.. ' +
          'Make sure the path is absolute! ->' + errMsg)
      })
    }
  }

  /**
   * caches a location object and returns a retrieval key.
   *
   * @memberof WhatSrcService
   */
  public cache = (loc: T.SourceLocationStart, sourcefile: string) => {
    const remoteFn = H.getRemoteFilenameOrNull(sourcefile, this.options)

    let filename = remoteFn || sourcefile

    if (filename.startsWith(this._cache.__basedir)) {
      filename = filename.slice(this._cache.__basedir.length)
    }

    const metaData = H.generateJsxMetaData(
      { ...loc, filename },
      this.options.useRemote,
    )

    return withHooks(() => this.nextId.toString(), {
      after: () => this.setCache(JSON.stringify(metaData)),
    }).result
  }

  /**
   * ignore any explicitly blacklisted tags. the blacklist is converted to a set
   * during class construction to be used for fast lookups
   *
   * @param {ts.JsxElement} node
   * @returns
   * @memberof WhatSrcTsTransformer
   */
  public tagIsBlacklisted(tagname: string) {
    return this.blockedTags.has(tagname)
  }

  /**
   * get cache file relative import path
   *
   * @returns
   * @memberof WhatSrcTsTransformer
   */
  public getCacheFileImport() {
    return isNullOrUndefined(this.options.cacheRequireOverride)
      ? '@what-src/runtime-cache'
      : this.options.cacheRequireOverride
  }

  /**
   * get the absolute path to the cache file
   *
   * @returns
   * @memberof WhatSrcTsTransformer
   */
  public getCacheFileLocation(rootDir: string, ft = '.js') {
    const path = ['node_modules', '@what-src', 'runtime-cache']
    return join(rootDir, ...path, 'index' + ft)
  }

  /**
   * resolves the base dir for the cache depending on if
   * useRemote is set. the path can be completely overriden
   * by setting the baseDirOverride options
   *
   * @param {string} basedir
   * @returns
   * @memberof WhatSrcService
   */
  public getBaseDirForCache(basedir: string) {
    if (this.options.baseDirOverride) return this.options.baseDirOverride
    else if (this.options.useRemote) return H.getGitRemoteBaseDir()
    else return basedir
  }

  /**
   * returns the source file location cache
   *
   * @memberof WhatSrcService
   */
  public getCache = (): T.WhatSrcCache => {
    return this._cache
  }

  /**
   *  sets the next cache value then increments the key
   *
   * @memberof WhatSrcService
   */
  public setCache = (metaData: string) => {
    this._cache[this.nextId++] = metaData
  }

  /**
   * get the basedir as set in the cache
   *
   * @readonly
   * @memberof WhatSrcService
   */
  public get basedir() {
    return this._cache.__basedir
  }
}
