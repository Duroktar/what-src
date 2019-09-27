import * as H from './helpers'
import { defaultOptions as defaults } from './options'
import * as T from './types'
import ts from 'typescript'

class Resolver {
  public options: T.WhatSrcConfiguration
  private nextId: number = 1

  constructor(
    public defaultOptions: T.WhatSrcPluginOptions,
    public cache: T.CacheType,
    public basedir: string,
  ) {
    this.options = H.getAllPluginOptions(defaultOptions, defaults)
    this.cache.__basedir = basedir
  }

  public emit = (location: string) => {
    const source = H.generateClickHandlerRawString(this.options, this.cache)

    const result = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    })

    const host = ts.createCompilerHost(this.options)
    host.writeFile(location, result.outputText, false)
  }

  public resolve = (loc: T.SourceLocationStart, sourcefile: string) => {
    const filename = H.getRemoteFilenameIfSet(sourcefile, this.options)
    const metaData = H.generateJsxMetaData({
      ...loc,
      filename: filename.replace(this.basedir, ''),
    })
    const result = this.nextId.toString()
    this.cache[this.nextId++] = JSON.stringify(metaData)
    return result
  }

  public getCache = () => {
    return this.cache
  }
}

export const getResolver = ({ options, basedir, cache = { __basedir: '' } }) => {
  return new Resolver(options, cache, basedir)
}
