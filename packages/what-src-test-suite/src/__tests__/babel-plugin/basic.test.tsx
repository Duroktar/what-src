import * as babel from '@babel/core'
import plugin from '@what-src/babel-plugin'
import { WhatSrcPluginOptions } from '@what-src/plugin-core'
import { basicComponents } from '../../fixtures/component.fixture'

const configuration: WhatSrcPluginOptions = {
  cacheLocOverride: '/CACHE_LOCATION/OVERRIDE',
  createCacheDir: false,
  createCacheFile: false,
}

it('works', () => {
  const res = babel.transformSync(basicComponents, {
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
