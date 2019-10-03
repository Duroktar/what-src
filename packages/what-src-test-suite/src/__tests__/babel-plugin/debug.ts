import * as babel from '@babel/core'
import plugin from '@what-src/babel-plugin'
import { WhatSrcPluginOptions } from '@what-src/plugin-core'

const example = `
import * as React from 'react'

class App extends React.Component {
  render() {
    return (
      <div className="first">
        <p>some p thing</p>
      </div>
    )
  }
}
`

// function testcallback(...args) {
//   console.log(args)
// }

const res = babel.transformSync(example, {
  // metadataSubscribers: [testcallback],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      plugin, {
        productionMode: true,
      } as WhatSrcPluginOptions,
    ],
  ],
  filename: 'dontmatter.tsx',
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
  ],
})

console.log(res)