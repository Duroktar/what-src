import * as T from '@what-src/plugin-core'

const service = T.getService({
  basedir: '/home/user/app/packages/',
  cache: {},
  options: {},
})

it('caches source locations', () => {
  const testArgs = [
    [{ col: 1, line: 2 }, 'filename1.ts'],
    [{ col: 4, line: 7 }, 'filename2.ts'],
    [{ col: 8, line: 1 }, 'filename3.ts'],
  ] as const

  const cacheKeys: string[] = []

  testArgs.forEach(test => {
    cacheKeys.push(service.cache(test[0], test[1]))
  })

  expect<T.SourceCache>(service.getSourceCache()).toMatchSnapshot()
})
