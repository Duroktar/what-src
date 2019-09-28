import ts from 'typescript'
import path from 'path'
import * as WS from '@what-src/plugin-core'
import { getIn, withHooks } from '@what-src/utils'
import { WhatSrcTsTransformerOptions } from './types'

/**
 * creates the what-src TS compiler API transformer
 *
 * @export
 * @param {WhatSrcTsTransformerOptions} [opts={}]
 * @returns
 */
export function createTransformer(opts: WhatSrcTsTransformerOptions = {}) {
  return new WhatSrcTsTransformer(opts).transformer
}

/**
 * the what-src TS compiler API transformer
 *
 * @export
 * @class WhatSrcTsTransformer
 */
export class WhatSrcTsTransformer {
  public options: Required<WS.WhatSrcPluginOptions>
  public basedir: string
  public importName: string
  public service: WS.WhatSrcService
  public context!: ts.TransformationContext
  public sourceFile!: ts.SourceFile
  public module?: ts.ModuleKind
  public cacheFile!: string
  private blockedTags!: Set<string>

  /**
   * Constructs a TS compiler API transformer
   * @param {WhatSrcTsTransformerOptions} defaultOptions
   * @param {WS.CacheType} [cache={ __basedir: '' }]
   * @memberof WhatSrcTsTransformer
   */
  constructor(public defaultOptions: WhatSrcTsTransformerOptions, public cache: WS.SourceCache = { __basedir: '' }) {
    this.basedir = '/Users/duroktar/fun/what-src-webpack-plugin/packages/what-src-example-typescript-loader/src/' // TODO
    this.options = WS.mergePluginOptions(defaultOptions)
    this.service = WS.getService(this)
    this.importName = this.options.importName
    this.blockedTags = new Set(this.options.blacklistedTags)
  }

  /**
   * TS compiler API transformer application method
   *
   * @type {ts.TransformerFactory<ts.SourceFile>}
   * @memberof WhatSrcTsTransformer
   */
  public transformer: ts.TransformerFactory<ts.SourceFile> = context => {
    const { outDir, module: mod } = context.getCompilerOptions()
    this.context = context
    this.module = mod
    this.cacheFile = this.getFullCacheFilePath(outDir)

    const entrance = () => ts.visitNode(this.sourceFile, this.visitor)
    const afterHook = () => this.service.emit(this.cacheFile)

    return (sourceFile: ts.SourceFile) => {
      this.sourceFile = sourceFile
      return withHooks(entrance, { after: afterHook }).result
    }
  }

  /**
   * the node visitor attaches what-src tags to elements and injects the click
   * listener library import statement. remember to continue the traversal
   *
   * @private
   * @memberof WhatSrcTsTransformer
   */
  private visitor = (node: ts.Node): ts.VisitResult<ts.Node> => {
    // inject what-src cache-file import statement
    if (ts.isSourceFile(node)) {
      // <3 <3 <3 https://github.com/Microsoft/TypeScript/issues/18369#issuecomment-330133796

      // const WhatSrcGlobalVariable = require('../../what-src-cache.js')  <-- example
      if (this.module === ts.ModuleKind.CommonJS) {
        node = this.createCommonJSImport(node, this.cacheFile)
      }

      // import WhatSrcGlobalVariable from '../../what-src-cache.js'   <-- example
      if (this.module === ts.ModuleKind.ES2015 || this.module === ts.ModuleKind.ESNext) {
        node = this.createModernJSImport(node, this.cacheFile)
      }
    }

    // decorate any valid elements with a what-src tag
    if (ts.isJsxElement(node) && !ts.isJsxFragment(node)) {
      this.createAndUpdateJsxAttribute(node)
    }

    // not sure if this is needed or not, to be honest :/
    ts.forEachChild(node, n => {
      if (!n.parent) n.parent = node
    })

    return ts.visitEachChild(node, this.visitor, this.context)
  }

  /**
   * creates the what-src import statement modern style (ES2015, EsNext)
   *
   * @private
   * @memberof WhatSrcTsTransformer
   */
  private createModernJSImport = (node: ts.Node, cacheFile: string) => {
    const file = (node as ts.Node) as ts.SourceFile
    node = ts.updateSourceFileNode(file, [
      ts.createImportDeclaration(
        /* decorators */ undefined,
        /* modifiers */ undefined,
        ts.createImportClause(
          ts.createIdentifier(this.importName),
          undefined
        ),
        ts.createLiteral(cacheFile)
      ),
      ...file.statements,
    ])
    return node
  }

  /**
   * creates the what-src import statement commonjs style
   *
   * @private
   * @memberof WhatSrcTsTransformer
   */
  private createCommonJSImport = (node: ts.Node, cacheFile: string) => {
    const file = (node as ts.Node) as ts.SourceFile
    node = ts.updateSourceFileNode(file, [
      ts.createVariableStatement(
        /* modifiers */ undefined,
        ts.createVariableDeclarationList([
          ts.createVariableDeclaration(this.importName,
            /* type */ undefined,
            ts.createPropertyAccess(
              ts.createCall(
                ts.createIdentifier('require'),
                [],
                [ts.createLiteral(cacheFile)]
              ),
              ts.createIdentifier('default'))),
        ])),
      ...file.statements,
    ])
    return node
  }

  /**
   * - Gets the line data needed from the opening element start position.
   * - Generates and attaches the next what-src attribute to the passed node
   *
   * @private
   * @memberof WhatSrcTsTransformer
   */
  private createAndUpdateJsxAttribute = (node: ts.JsxElement) => {
    if (ts.isJsxOpeningElement(node.openingElement)) {
      // skip any blacklisted nodes by tag (needed for use with `react-helmet`)
      if (this.tagIsNotBlacklisted(node)) {
        const start = node.openingElement.getStart()
        const { character, line } = this.sourceFile.getLineAndCharacterOfPosition(start)
        // gather the necessary metadata. we need a location and unique id
        const location = this.createSourceLocation(character, line)
        const nextId = this.service.cache(location, this.sourceFile.fileName)
        // create the data attribute and add to existing
        const attributes = node.openingElement.attributes
        const newAttributes = ts.updateJsxAttributes(attributes, [
          ts.createJsxAttribute(
            ts.createIdentifier(this.options.dataTag),
            ts.createStringLiteral(nextId)
          )])
        // set opening element attributes to the new list
        node.openingElement.attributes = newAttributes
      }
    }
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
  private tagIsNotBlacklisted(node: ts.JsxElement) {
    return !this.blockedTags.has(this.getOpeningElementTagName(node))
  }

  /**
   * get normalized full path to the cache file
   *
   * @private
   * @param {(string | undefined)} outDir
   * @returns
   * @memberof WhatSrcTsTransformer
   */
  private getFullCacheFilePath(outDir: string | undefined) {
    return path.join(outDir || '', this.options.importFrom)
  }

  /**
   * creates source location objects
   *
   * @private
   * @param {number} character
   * @param {number} line
   * @returns
   * @memberof WhatSrcTsTransformer
   */
  private createSourceLocation(character: number, line: number) {
    return {
      basedir: this.basedir,
      col: character,
      line: line + 1,
      filename: this.options.importFrom,
    } as WS.SourceLocationFullStart
  }

  /**
   * helper function to get the name of the openeing jsx element for the passed
   * node
   *
   * @export
   * @param {ts.JsxElement} node
   * @returns {(string | null)}
   */
  private getOpeningElementTagName(node: ts.JsxElement): string {
    return getIn('openingElement.tagName.escapedText', node) || ''
  }
}

export default createTransformer
