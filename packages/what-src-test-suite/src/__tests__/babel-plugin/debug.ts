import * as babel from '@babel/core'
import plugin from '@what-src/babel-plugin'
import { WhatSrcPluginOptions } from '@what-src/plugin-core'
import { basicComponents } from '../../fixtures/component.fixture'

const res = babel.transformSync(basicComponents, {
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
