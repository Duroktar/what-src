
import * as ts from 'typescript'
import { createTransformer, WhatSrcTsTransformer } from '@what-src/typescript-plugin'

const compilerOptions: ts.CompilerOptions = {
  module: ts.ModuleKind.CommonJS,
  jsx: ts.JsxEmit.React,
  target: ts.ScriptTarget.ESNext,
  importHelpers: true,
}

const transformerOptions = {
  cacheLocOverride: '/CACHE_LOCATION/OVERRIDE',
  createCacheDir: false,
  createCacheFile: false,
}

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

describe('ts-transformer plugin basic tests', () => {
  it('works as advertised', () => {
    const result = ts.transpileModule(sourceText, {
      compilerOptions,
      transformers: { before: [createTransformer(transformerOptions)] },
    })

    expect(result.outputText).toMatchSnapshot()
  })

  it('can optionally take a ts.Loader argument', () => {
    expect(createTransformer({}, transformerOptions)).not.toBeNull()
  })

  it('can also be disabled if needed', () => {
    const Transformer = WhatSrcTsTransformer as any
    const logger = { log: () => null, error: () => null }
    const old = process.env.NODE_ENV

    process.env.NODE_ENV = 'production'

    const plug = new Transformer({}, null, null, null, logger)
    expect(plug.disabled).toEqual(true)

    process.env.NODE_ENV = old

    const plug2 = new Transformer({}, null, null, null, logger)
    expect(plug2.disabled).toEqual(false)
  })
})
