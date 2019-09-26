import ts from "typescript";
import path from "path";
import * as H from "@what-src/plugin-core";

type UserOptions = { importName: string; importFrom: string };

export function createTransformer(opts: UserOptions = {} as any) {
  let basedir = '/Users/duroktar/fun/what-src-webpack-plugin/packages/what-src-example-typescript-loader/src/'
  const options = H.getAllPluginOptions({});
  const resolver = H.getResolver({ options, basedir, cache: {} });
  const cacheFile = opts.importFrom || 'what-src-cache'
  const importName = opts.importName || '__WhatSrcGlobalVariable'

  const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
    const { module, outDir } = context.getCompilerOptions()
    const cacheFilePath = path.join(outDir || '', cacheFile)

    // !!! Each file
    return sf => {

      const visitor: ts.Visitor = node => {

        if (ts.isSourceFile(node)) {
          // <3 <3 <3 https://github.com/Microsoft/TypeScript/issues/18369#issuecomment-330133796

          // const WhatSrcGlobalVariable = require('../../what-src-cache.js')   <-- example
          if (module === ts.ModuleKind.CommonJS) {
            const file = (node as ts.Node) as ts.SourceFile
            node = ts.updateSourceFileNode(file, [
              ts.createVariableStatement(
                /*modifiers*/ undefined,
                ts.createVariableDeclarationList([
                  ts.createVariableDeclaration(
                    importName,
                    /*type*/ undefined,
                    ts.createPropertyAccess(
                      ts.createCall(
                        ts.createIdentifier('require'),
                        [],
                        [ts.createLiteral(cacheFilePath)]
                      ),
                      ts.createIdentifier('default')
                    )
                  ),
                ])
              ),
              ...file.statements
            ])
          }

          // import WhatSrcGlobalVariable from '../../what-src-cache.js'   <-- example
          if (module === ts.ModuleKind.ES2015 || module === ts.ModuleKind.ESNext) {
            const file = (node as ts.Node) as ts.SourceFile
            node = ts.updateSourceFileNode(file, [
              ts.createImportDeclaration(
                /* decorators */ undefined,
                /* modifiers */ undefined,
                ts.createImportClause(ts.createIdentifier(importName), undefined),
                ts.createLiteral(cacheFilePath)
              ),
              ...file.statements
            ])
          }
        }

        if (ts.isJsxElement(node) && !ts.isJsxFragment(node)) {
          if (ts.isJsxOpeningElement(node.openingElement)) {
            const { character: col, line } = sf.getLineAndCharacterOfPosition(
              node.openingElement.getStart()
            );

            const nextId = resolver.resolve({ col, line: line + 1, basedir }, sf.fileName);

            const attrs = ts.updateJsxAttributes(node.openingElement.attributes, [
              ts.createJsxAttribute(
                ts.createIdentifier(options.dataTag),
                ts.createStringLiteral(nextId as any)
              )])
              node.openingElement.attributes = attrs
          }
        }

        ts.forEachChild(node, n => {
          if (!n.parent) n.parent = node;
        });

        return ts.visitEachChild(node, visitor, context);
      };

      const last = ts.visitNode(sf, visitor);

      resolver.emit(cacheFilePath)

      return last
    };
  };

  return transformer;
}

export default createTransformer;
