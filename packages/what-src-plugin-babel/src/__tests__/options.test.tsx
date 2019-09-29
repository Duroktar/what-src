import { defaultOptions } from '@what-src/plugin-core'
import { WhatSrcBabelPlugin } from '../plugin'

const plugin = new WhatSrcBabelPlugin()
const dataTag = plugin.options.dataTag
const testTag = 'TEST_DATA_TAG'

describe('what-src babel-plugin configuration', () => {
  it('is stable', () => {
    expect(plugin.options).toMatchSnapshot()
  })

  it('has defaults', () => {
    expect(plugin.options).toEqual(defaultOptions)
  })

  it('is initially configurable', () => {
    const plugin2 = new WhatSrcBabelPlugin({ dataTag: testTag })
    expect(plugin2.options.dataTag).toEqual(testTag)
    plugin2.options.dataTag = dataTag
    expect(plugin2.options.dataTag).toEqual(dataTag)
  })

  it('is later configurable', () => {
    plugin.options.dataTag = testTag
    expect(plugin.options.dataTag).toEqual(testTag)
    plugin.options.dataTag = dataTag
    expect(plugin.options.dataTag).toEqual(dataTag)
  })
})
