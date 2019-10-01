import template from '@babel/template'

export const buildRequire = template(`
  require(%%cacheFilePath%%);
`)
