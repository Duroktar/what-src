
module.exports = {
  mode: 'modules',
  out: 'docs/doc',
  name: '@what-src/plugin',
  exclude: [
    '**/what-src-example-*/**',
    '**/what-src-stats-*/**',
    '**/node_modules/**',
    '**/*.spec.ts',
  ],
  theme: './packages/what-src-typedoc-theme/default',
  ignoreCompilerErrors: 'true',
  'external-modulemap': String.raw`.*packages\/(what-src-[^\/]+)\/.*`,
  preserveConstEnums: 'true',
  excludePrivate: 'true',
  skipInternal: 'true',
}
