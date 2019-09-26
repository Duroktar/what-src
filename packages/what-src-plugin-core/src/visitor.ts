// import {isNullOrUndefined} from '@what-src/utils'
import * as H from './helpers'
import ts from 'typescript'

// const t = {} as any // TODO: import * as types from '@babel/types'

type SourceLocationStart = {col: number; basedir: string; line: number}

export const getResolver = ({options: opts, basedir, cache = {}}) => {
  const options = H.getAllPluginOptions(opts)
  let nextId = 1
  cache["__basedir"] = basedir
  return {
    emit(location: string) {
      const source = H.generateClickHandlerRawString(options, cache);

      let result = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS }
      });

      const host = ts.createCompilerHost(options)
      host.writeFile(location + '.js', result.outputText, false)
    },
    resolve(loc: SourceLocationStart, sourcefile: string) {
      const filename = H.getRemoteFilenameIfSet(sourcefile, options)
      const metaData = H.generateJsxMetaData({
        ...loc,
        filename: filename.replace(basedir, ''),
      })
      const result = nextId.toString()
      cache[nextId++] = JSON.stringify(metaData)
      return result
    },
    getCache() {
      return cache
    }
  }
}

