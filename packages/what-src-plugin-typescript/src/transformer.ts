import ts from 'typescript'
import path from 'path'
import * as WS from '@what-src/plugin-core'
import { getIn } from '@what-src/utils'
import { WhatSrcTsTransformerOptions } from './types'

/**
 * the what-src TS compiler API transformer
 *
 * @export
 * @class WhatSrcTsTransformer
 */
export class WhatSrcTsTransformer {
  public basedir: string
  public options: Required<WS.WhatSrcPluginOptions>
  public resolver: WS.IResolver
  public cacheFile: string
  public importName: string

  /**
   * Constructs a TS compiler API transformer
   * @param {WhatSrcTsTransformerOptions} defaultOptions
   * @param {WS.CacheType} [cache={ __basedir: '' }]
   * @memberof WhatSrcTsTransformer
   */
  constructor(public defaultOptions: WhatSrcTsTransformerOptions, public cache: WS.CacheType = { __basedir: '' }) {
    this.basedir = '/Users/duroktar/fun/what-src-webpack-plugin/packages/what-src-example-typescript-loader/src/'
    this.options = WS.getAllPluginOptions(defaultOptions)
    this.resolver = WS.getResolver(this)
    this.cacheFile = defaultOptions.importFrom || 'what-src-cache'
    this.importName = defaultOptions.importName || '__WhatSrcGlobalVariable'
  }

  /**
   * TS compiler API transformer application method
   *
   * @type {ts.TransformerFactory<ts.SourceFile>}
   * @memberof WhatSrcTsTransformer
   */
  public transformer: ts.TransformerFactory<ts.SourceFile> = context => {
    const { outDir } = context.getCompilerOptions()
    const cacheFilePath = path.join(outDir || '', this.cacheFile)

    return this.createSourceFileHandler(cacheFilePath, context)
  }

  /**
   * creates a SourceFileHandler that emits the cache file as a post hook
   *
   * @private
   * @memberof WhatSrcTsTransformer
   */
  private createSourceFileHandler = (cacheFilePath: string, context: ts.TransformationContext) => {
    return (sf: ts.SourceFile) => {
      const last = ts.visitNode(sf, this.createVisitor(context, sf))
      this.resolver.emit(cacheFilePath)
      return last
    }
  }

  /**
   * creates a visitor node for a given TransformationContext and SourceFile
   *
   * @private
   * @memberof WhatSrcTsTransformer
   */
  private createVisitor = (context: ts.TransformationContext, sf: ts.SourceFile) => {
    return (node: ts.Node): ts.VisitResult<ts.Node> => {
      return this.visitor(node, context, sf)
    }
  }

  /**
   * the node visitor attaches what-src tags to elements and injects the click
   * listener library import statement. remember to continue the traversal
   *
   * @private
   * @memberof WhatSrcTsTransformer
   */
  private visitor = (node: ts.Node, context: ts.TransformationContext, sf: ts.SourceFile): ts.VisitResult<ts.Node> => {
    const { module, outDir } = context.getCompilerOptions()
    const cacheFilePath = path.join(outDir || '', this.cacheFile)

    if (ts.isSourceFile(node)) {
      // <3 <3 <3 https://github.com/Microsoft/TypeScript/issues/18369#issuecomment-330133796

      // const WhatSrcGlobalVariable = require('../../what-src-cache.js')  <-- example
      if (module === ts.ModuleKind.CommonJS) {
        const file = (node as ts.Node) as ts.SourceFile
        node = this.createCommonJSImport(node, file, cacheFilePath)
      }

      // import WhatSrcGlobalVariable from '../../what-src-cache.js'   <-- example
      if (module === ts.ModuleKind.ES2015 || module === ts.ModuleKind.ESNext) {
        const file = (node as ts.Node) as ts.SourceFile
        node = this.createModernJSImport(node, file, cacheFilePath)
      }
    }

    if (ts.isJsxElement(node) && !ts.isJsxFragment(node)) {
      this.createAndUpdateJsxAttribute(sf, node)
    }

    // not sure if this is needed or not, to be honest :/
    ts.forEachChild(node, n => {
      if (!n.parent) n.parent = node
    })

    return ts.visitEachChild(node, this.createVisitor(context, sf), context)
  }

  /**
   * creates the what-src import statement modern style (ES2015, EsNext)
   *
   * @private
   * @memberof WhatSrcTsTransformer
   */
  private createModernJSImport = (node: ts.Node, file: ts.SourceFile, cacheFilePath: string) => {
    node = ts.updateSourceFileNode(file, [
      ts.createImportDeclaration(
        /* decorators */ undefined,
        /* modifiers */ undefined, ts.createImportClause(ts.createIdentifier(this.importName), undefined), ts.createLiteral(cacheFilePath)),
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
  private createCommonJSImport = (node: ts.Node, file: ts.SourceFile, cacheFilePath: string) => {
    node = ts.updateSourceFileNode(file, [
      ts.createVariableStatement(
        /* modifiers */ undefined, ts.createVariableDeclarationList([
          ts.createVariableDeclaration(this.importName,
            /* type */ undefined, ts.createPropertyAccess(ts.createCall(ts.createIdentifier('require'), [], [ts.createLiteral(cacheFilePath)]), ts.createIdentifier('default'))),
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
  private createAndUpdateJsxAttribute = (sf: ts.SourceFile, node: ts.JsxElement) => {
    if (ts.isJsxOpeningElement(node.openingElement)) {
      const start = node.openingElement.getStart()
      const { character, line } = sf.getLineAndCharacterOfPosition(start)
      if (this.openingElementTagName(node)! in this.options) {
        const location = this.createLocation(character, line)
        const nextId = this.resolver.resolve(location, sf.fileName)
        const attributes = node.openingElement.attributes
        const attrs = ts.updateJsxAttributes(attributes, [
          ts.createJsxAttribute(
            ts.createIdentifier(this.options.dataTag),
            ts.createStringLiteral(nextId)
          )])
        node.openingElement.attributes = attrs
      }
    }
  }

  /**
   * model for every click event
   *
   * @private
   * @param {number} character
   * @param {number} line
   * @returns
   * @memberof WhatSrcTsTransformer
   */
  private createLocation(character: number, line: number) {
    return {
      basedir: this.basedir,
      col: character,
      line: line + 1,
      filename: this.cacheFile,
    }
  }

  /**
   * helper function to get the name of the openeing jsx element for the passed node
   *
   * @export
   * @param {ts.JsxElement} node
   * @returns {(string | null)}
   */
  private openingElementTagName(node: ts.JsxElement): string | null {
    return getIn('openingElement.tagName.escapedText', node)
  }
}

/**
 * creates the what-src TS compiler API transformer
 *
 * @export
 * @param {WhatSrcTsTransformerOptions} [opts={} as any]
 * @returns
 */
export function createTransformer(opts: WhatSrcTsTransformerOptions = {} as any) {
  return new WhatSrcTsTransformer(opts).transformer
}

export default createTransformer
