import { defaultOptions } from '@what-src/plugin-core'
import { WhatSrcBabelPlugin } from '@what-src/babel-plugin'

const plugin = new WhatSrcBabelPlugin()

describe('what-src babel-plugin configuration', () => {
  it('is stable', () => {
    expect(plugin.options).toMatchSnapshot()
  })

  it('has defaults', () => {
    expect(plugin.options).toEqual(defaultOptions)
  })
})
