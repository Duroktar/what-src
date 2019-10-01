
import * as ts from 'typescript'
import { createTransformer } from './transformer'

const transformerOptions = {}

const sourceText = `
import * as React from 'react'

export const App = () => (
  <div className="first">
    <p>some p thing</p>
  </div>
)
`

const result = ts.transpileModule(sourceText, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.React,
  },
  transformers: { before: [createTransformer(transformerOptions)] },
})

console.log('noop' || result.outputText)
