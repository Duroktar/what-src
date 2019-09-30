import * as babel from '@babel/core'
import { WhatSrcPluginOptions } from '@what-src/plugin-core'
import whatSrcBabelPlugin from '@what-src/babel-plugin'

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

describe('works as a babel-plugin with preset-typescript', () => {
  it('works in development mode', () => {
    const res = babel.transformSync(example, {
      envName: 'development',
      plugins: [whatSrcBabelPlugin],
      filename: 'README.md',
      presets: [
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    })

    expect(res).toHaveProperty('code')

    expect(res!.code).toMatchSnapshot()
  })

  it('works in production mode', () => {
    const configuration: WhatSrcPluginOptions = {
      useRemote: true,
      productionMode: true,
    }

    const res = babel.transformSync(example, {
      envName: 'production',
      plugins: [[whatSrcBabelPlugin, configuration]],
      filename: 'README.md',
      presets: [
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    })

    expect(res).toHaveProperty('code')

    expect(res!.code).toMatchSnapshot()
  })
})
