import * as H from './helpers'
import { defaultOptions, defaultCache } from './options'
import * as T from './types'
import ts from 'typescript'

type ServiceOptions = {
  options: T.WhatSrcPluginOptions;
  basedir: string;
  cache: T.SourceCache;
}

/**
 * create a new what-src service instance
 *
 * @param {"WhatSrcService"} { options, basedir, cache = defaultCache }
 * @returns new what-src service instance
 */
export const getService = ({ options, ...args }: ServiceOptions) => {
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
  private blockedTags!: Set<string>

  constructor(
    options: T.WhatSrcPluginOptions,
    public basedir: string,
    private _cache: T.SourceCache = defaultCache,
  ) {
    this.options = H.mergePluginOptions(options, defaultOptions)
    this.blockedTags = new Set(this.options.blacklistedTags)
    this._cache.__basedir = basedir
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
    const filename = H.getRemoteFilenameIfSet(sourcefile, this.options)
    const metaData = H.generateJsxMetaData({
      ...loc,
      filename: filename.replace(this.basedir, ''),
    })
    const result = this.nextId.toString()
    this._cache[this.nextId++] = JSON.stringify(metaData)
    return result
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
}
