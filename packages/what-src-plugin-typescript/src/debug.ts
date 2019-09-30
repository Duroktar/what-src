
import * as ts from 'typescript'
import { createTransformer } from './transformer'
// import path from 'path'
// import fs from 'fs'

// const tsconfig = path.join(__dirname, '..', 'tsconfig.json')

// const compilerOptions = JSON.parse(fs.openSync(tsconfig, 'r') + '')
const transformerOptions = {}

const sourceText = `

import * as React from 'react'

export const App = () => (
  <div className="first">
    <p>some p thing</p>
  </div>
)

`

// const sourceFile = ts.createSourceFile(
//   'anything.tsx',
//   sourceText,
//   ts.ScriptTarget.ES2015,
// )

// const result = ts.transform(sourceFile,
//   [createTransformer(transformerOptions)],
//   compilerOptions
// )

const result = ts.transpileModule(sourceText, {
  transformers: { before: [createTransformer(transformerOptions)] },
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.React,
  },
  // compilerOptions,
})

console.log(result.outputText)
