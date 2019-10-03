import * as babel from '@babel/core'
import whatSrcBabelPlugin, { WhatSrcBabelPlugin } from '@what-src/babel-plugin'
import { WhatSrcPluginOptions } from '@what-src/plugin-core'
import { basicComponents } from '../../fixtures/component.fixture'

describe('works as a babel-plugin', () => {
  const configuration: WhatSrcPluginOptions = {
    cacheLocOverride: '/CACHE_LOCATION/OVERRIDE',
    baseDirOverride: '',
    createCacheDir: false,
    createCacheFile: false,
  }
  it('works in development mode', () => {
    const res = babel.transformSync(basicComponents, {
      envName: 'development',
      plugins: [
        '@babel/plugin-transform-runtime',
        [whatSrcBabelPlugin, configuration],
      ],
      filename: 'README.md',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
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
      plugins: [
        '@babel/plugin-transform-runtime',
        [whatSrcBabelPlugin, configuration],
      ],
      filename: 'README.md',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
    })

    expect(res).toHaveProperty('code')

    expect(res!.code).toMatchSnapshot()
  })

  it("prints a warning in 'production' when `productionMode` isn't set", () => {
    const state = {
      count: 0,
      error: 0,
    }
    const tick = () => state.count++
    const logger = { log: tick, error: tick } as any
    const old = process.env.NODE_ENV

    // ** set production mode **
    process.env.NODE_ENV = 'production'

    const plug1 = new WhatSrcBabelPlugin({
      //
    }, undefined, undefined, logger)
    expect(plug1.disabled).toBeTruthy()
    expect(state.count).toEqual(1)

    const plug2 = new WhatSrcBabelPlugin({
      productionMode: true,
    }, undefined, undefined, logger)
    expect(plug2.disabled).toBeFalsy()
    expect(state.count).toEqual(1)

    // ** revert production mode **
    process.env.NODE_ENV = old

    const plug3 = new WhatSrcBabelPlugin({
      //
    }, undefined, undefined, logger)
    expect(plug3.disabled).toBeFalsy()
    expect(state.count).toEqual(1)

    expect(state.error).toEqual(0)
  })

  it('can override the cache location', () => {
    let plug!: WhatSrcBabelPlugin
    const identifier = `OOGIE_BOOGEY_${Date.now()}`

    babel.transformSync(basicComponents, {
      envName: 'production',
      plugins: [
        '@babel/plugin-transform-runtime',
        [(ctx, cfg) => {
          plug = new WhatSrcBabelPlugin(cfg)
          return plug.getPlugin()
        }, {
          ...configuration,
          cacheLocOverride: identifier,
        } as WhatSrcPluginOptions],
      ],
      filename: 'README.md',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
    })

    expect((plug as any).CACHE_DIR).toMatch(identifier)
  })

  it('can override the cache import string', () => {
    let plug!: WhatSrcBabelPlugin
    const identifier = `OOGIE_BOOGEY_${Date.now()}`

    babel.transformSync(basicComponents, {
      envName: 'production',
      plugins: [
        '@babel/plugin-transform-runtime',
        [(ctx, cfg) => {
          plug = new WhatSrcBabelPlugin(cfg)
          return plug.getPlugin()
        }, {
          ...configuration,
          cacheRequireOverride: identifier,
        } as WhatSrcPluginOptions],
      ],
      filename: 'README.md',
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
    })

    expect((plug as any).CACHE_IMPORT).toMatch(identifier)
  })
})
