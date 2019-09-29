// import * as ts from 'typescript'
// import * as H from '../helpers'
import { defaultOptions } from '../options'
import { getService } from '../service'
import { WhatSrcConfiguration } from '../types'

describe('what-src configuration', () => {
  const service = getService()
  const options = service.options

  it('has stable output', () => {
    expect<WhatSrcConfiguration>(options).toMatchSnapshot()
  })

  it('has default options', () => {
    expect(options).toEqual(defaultOptions)
  })

  it('is configurable', () => {
    const originalServerUrl = options.serverUrl
    options.serverUrl = 'new_server_url'
    expect(options.serverUrl).toEqual('new_server_url')
    options.serverUrl = originalServerUrl
    expect(options.serverUrl).toEqual(originalServerUrl)
  })

  it('doesn\'t run in production mode by default', () => {
    expect(options.productionMode).toBeFalsy()
  })
})
