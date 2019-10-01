import * as babel from '@babel/core'
import plugin from '@what-src/babel-plugin'
import { WhatSrcPluginOptions } from '@what-src/plugin-core'

const example = `
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

const configuration: WhatSrcPluginOptions = {
  cacheLocOverride: '/CACHE_LOCATION/OVERRIDE',
  createCacheDir: false,
  createCacheFile: false,
}

it('works', () => {
  const res = babel.transformSync(example, {
    plugins: [
      '@babel/plugin-transform-runtime',
      [plugin, configuration],
    ],
    filename: 'testfile.ts',
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
  })
  expect(res!.code).toMatchSnapshot()
})
