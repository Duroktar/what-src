import * as ts from 'typescript'
import { getService } from '../service'
import * as H from '../helpers'

const service = getService({
  basedir: '/home/user/app/packages/',
  cache: {},
  options: {},
})

it('emits a cache file', () => {
  const source = H.generateClickHandlerRawString(
    service.options,
    service.getSourceCache(),
  )

  const result = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  })

  expect<string>(result.outputText).toMatchSnapshot()
})
