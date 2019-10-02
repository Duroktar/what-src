import ts from 'typescript'
import * as WS from '@what-src/plugin-core'
import { getIn, withHooks, isNodeEnvProduction } from '@what-src/utils'
import { WhatSrcTsTransformerOptions } from './types'

/**
 * Factory function for TS TransformerFactory<ts.SourceFile> instances.
 *
 * @export
 * @param {*} tsLoaderOpts
 * @param {*} [userOpts]
 * @returns {ts.TransformerFactory<ts.SourceFile>}
 */
export function createTransformer(tsLoaderOpts: any, userOpts?: any): ts.TransformerFactory<ts.SourceFile> {
  if (arguments.length === 1) {
    return new WhatSrcTsTransformer(tsLoaderOpts).transformer
  } else {
    return new WhatSrcTsTransformer(userOpts, tsLoaderOpts).transformer
  }
}

/**
 * The what-src TS compiler API transformer
 *
 * @export
 * @class WhatSrcTsTransformer
 */
export class WhatSrcTsTransformer {
  /**
   * full set of what-src configuration options
   *
   * @type {WS.WhatSrcConfiguration}
   * @memberof WhatSrcBabelPlugin
   */
  public options: Required<WS.WhatSrcPluginOptions>
  /**
   * instance if @what-src/core `WhatSrcService`
   *
   * @type {WS.WhatSrcService}
   * @memberof WhatSrcBabelPlugin
   */
  public service: WS.WhatSrcService
  /**
   * disabled flag used for bypassing the plugin
   *
   * @type {boolean}
   * @memberof WhatSrcBabelPlugin
   */
  public disabled: boolean = false

  /**
   * The typescript compiler transformation context.
   *
   * @type {ts.TransformationContext}
   * @memberof WhatSrcTsTransformer
   */
  public context!: ts.TransformationContext

  /**
   * A reference to the current source file under compilation.
   *
   * @type {ts.SourceFile}
   * @memberof WhatSrcTsTransformer
   */
  public sourceFile!: ts.SourceFile

  /**
   * A reference to the current module under compilation.
   *
   * @type {ts.ModuleKind}
   * @memberof WhatSrcTsTransformer
   */
  public module?: ts.ModuleKind

  /**
   *Creates an instance of WhatSrcTsTransformer.
   * @param {WhatSrcTsTransformerOptions} defaultOptions
   * @param {*} [host]
   * @param {string} [basedir=process.cwd()]
   * @param {WS.WhatSrcCache} [cache=WS.defaultCache]
   * @param {Console} [logger=console]
   * @memberof WhatSrcTsTransformer
   */
  constructor(
    public defaultOptions: WhatSrcTsTransformerOptions,
    public host?: any, // ts.LanguageServiceHost,  // TODO: what is this interface?
    public basedir: string = process.cwd(), // TODO(Important): This needs to be set for cache optimization to work!
    public cache: WS.WhatSrcCache = WS.defaultCache,
    public logger: Console = console
  ) {
    this.options = WS.mergePluginOptions(defaultOptions)
    this.service = WS.getService(this)

    if (this.shouldPrintProductionWarning) {
      this.logger.log(
        '@what-src/typescript-plugin - running in production mode is disabled. ' +
        'To enable set the "productionMode" configuration option to true.',
      )
      this.disabled = true
    }
  }

  /**
   * Absolute path to the base cache directory.
   *
   * @private
   * @type {string}
   * @memberof WhatSrcTsTransformer
   */
  private CACHE_DIR!: string

  /**
   * Relative import path to the cache file.
   *
   * @private
   * @type {string}
   * @memberof WhatSrcTsTransformer
   */
  private CACHE_IMPORT!: string

  /**
   * TS compiler API transformer application method
   *
   * @type {ts.TransformerFactory<ts.SourceFile>}
   * @memberof WhatSrcTsTransformer
   */
  public transformer: ts.TransformerFactory<ts.SourceFile> = context => {
    const { module: mod } = context.getCompilerOptions()
    this.context = context
    this.module = mod
    const rootdir = this.options.cacheLocOverride || this.basedir
    this.CACHE_DIR = this.service.getCacheFileLocation(rootdir)
    this.CACHE_IMPORT = this.service.getCacheFileImport(rootdir)

    const entrance = () => ts.visitNode(this.sourceFile, this.visitor)

    return (sourceFile: ts.SourceFile) => {
      return withHooks(entrance, {
        before: () => { this.sourceFile = sourceFile },
        after: () => this.service.emit(this.CACHE_DIR),
      }).result
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
      node = this.createWhatSrcRuntimeRequire(node)
    }

    // decorate any valid elements with a what-src tag
    if (ts.isJsxElement(node) && !ts.isJsxFragment(node)) {
      node = this.createAndUpdateJsxAttribute(node)
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
  private createWhatSrcRuntimeRequire = (node: ts.Node) => {
    const file = (node as ts.Node) as ts.SourceFile
    node = ts.updateSourceFileNode(file, [
      ts.createExpressionStatement(
        ts.createPropertyAccess(
          ts.createCall(
            ts.createIdentifier('require'),
            [],
            [ts.createLiteral(this.CACHE_IMPORT)]
          ),
          ts.createIdentifier('default')
        )
      ),
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
      if (!this.service.tagIsBlacklisted(this.getOpeningElementTagName(node))) {
        // gather the necessary metadata. we need a location and unique id
        const start = this.getOpeningElementStartLocation(node)
        const location = new WS.SourceLocationBuilder()
          .withBasedir(this.basedir)
          .withCol(start.character + 1)
          .withLine(start.line + 1)
          .build()

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
    return node
  }

  /**
   * Node "OpeningElementStart" path selector
   *
   * @private
   * @param {traverse.NodePath<t.JSXElement>} path
   * @returns `{ line: number, column: number }`
   * @memberof WhatSrcBabelPlugin
   */
  private getOpeningElementStartLocation(node: ts.JsxElement) {
    const start = node.openingElement.pos
    return this.sourceFile.getLineAndCharacterOfPosition(start)
  }

  /**
   * checks the NODE_ENV state against the set production MODE to determine if
   * we should print a warning or not
   *
   * @readonly
   * @private
   * @memberof WhatSrcBabelPlugin
   */
  private get shouldPrintProductionWarning() {
    return !this.disabled && (isNodeEnvProduction() && !this.options.productionMode)
  }

  /**
   * helper function to get the name of the opening jsx element for a node
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
