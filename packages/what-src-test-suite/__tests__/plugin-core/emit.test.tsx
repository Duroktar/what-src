import * as ts from 'typescript'
import * as T from '@what-src/plugin-core'

const service = T.getService({
  basedir: '/home/user/app/packages/',
  cache: {},
  options: {},
})

it('emits a cache file', () => {
  const source = T.generateClickHandlerRawString(
    service.options,
    service.getSourceCache(),
  )

  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  })

  expect<string>(result.outputText).toMatchSnapshot()
})
