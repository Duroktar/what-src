
import * as ts from 'typescript'
import { createTransformer } from '@what-src/typescript-plugin'

const compilerOptions: ts.CompilerOptions = {
  module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.React,
  importHelpers: true,
}

const transformerOptions = {}

const sourceText = `
import * as React from 'react'

class TestClassComponent extends React.Component {
  render() {
    return (
      <div className="class-component">
        <p>some p thing</p>
      </div>
    )
  }
}

const TestFunctionalComponent = () => (
  <div className="functional-component">
    <p>some p thing</p>
  </div>
)

const TestMemoizedComponent = React.memo(() => (
  <div className="memoized-component">
    <p>some p thing</p>
  </div>
))
`

it('works', () => {
  const sourceFile = ts.createSourceFile(
    'anything.tsx',
    sourceText,
    ts.ScriptTarget.ES2015,
  )

  const result = ts.transform(sourceFile,
    [createTransformer(transformerOptions)],
    compilerOptions
  )

  expect(result.transformed).toMatchSnapshot()
})
