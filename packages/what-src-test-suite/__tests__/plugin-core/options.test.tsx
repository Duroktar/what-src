import * as T from '@what-src/plugin-core'

describe('what-src configuration', () => {
  const service = T.getService()
  const options = service.options

  it('has stable output', () => {
    expect<T.WhatSrcConfiguration>(options).toMatchSnapshot()
  })

  it('has default options', () => {
    expect(options).toEqual(T.defaultOptions)
  })

  it('doesn\'t run in production mode by default', () => {
    expect(options.productionMode).toBeFalsy()
  })

  it('is configurable', () => {
    const configurableService = T.getService({
      options: {
        productionMode: true,
      },
    })

    const customOptions = configurableService.options
    customOptions.serverUrl = 'new_server_url'
    expect(customOptions.serverUrl).toEqual('new_server_url')
    expect(customOptions.productionMode).toEqual(true)

    expect<T.WhatSrcConfiguration>(customOptions).toMatchSnapshot()
  })
})
