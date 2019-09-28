import template from '@babel/template'

export const buildRequire = template(`
  var %%importName%% = require(%%cacheFilePath%%);
`)
