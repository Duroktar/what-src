import * as babel from '@babel/core'
import { WhatSrcPluginOptions } from '@what-src/plugin-core'
import whatSrcBabelPlugin from '@what-src/babel-plugin'
import { basicComponents } from '../../fixtures/component.fixture'

describe('works as a babel-plugin with preset-typescript', () => {
  it('works in development mode', () => {
    const configuration: WhatSrcPluginOptions = {
      cacheLocOverride: '/CACHE_LOCATION/OVERRIDE',
      createCacheDir: false,
      createCacheFile: false,
    }
    const res = babel.transformSync(basicComponents, {
      envName: 'development',
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

  it('works in production mode', () => {
    const configuration: WhatSrcPluginOptions = {
      useRemote: true,
      productionMode: true,
      cacheLocOverride: '/CACHE_LOCATION/OVERRIDE',
      createCacheDir: false,
      createCacheFile: false,
    }

    const res = babel.transformSync(basicComponents, {
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
