
import * as ts from 'typescript'
import { createTransformer } from '@what-src/typescript-plugin'
import { basicComponents } from '../../fixtures/component.fixture'

const compilerOptions: ts.CompilerOptions = {
  module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.React,
  importHelpers: true,
}

const transformerOptions = {}

const result = ts.transpileModule(basicComponents, {
  compilerOptions,
  transformers: { before: [createTransformer(transformerOptions)] },
})

console.log('noop' || result.outputText)
