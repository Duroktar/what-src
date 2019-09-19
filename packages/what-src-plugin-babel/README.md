
# @what-src/babel-plugin

[![npm](https://img.shields.io/npm/v/@what-src/babel-plugin.svg?maxAge=3600)](https://www.npmjs.com/package/@what-src/babel-plugin) [![Dependency Status](https://david-dm.org/duroktar/what-src.svg?path=packages/what-src-plugin-babel)](https://david-dm.org/duroktar/what-src?path=packages/what-src-plugin-babel) [![devDependency Status](https://david-dm.org/duroktar/what-src/dev-status.svg?path=packages/what-src-plugin-babel)](https://david-dm.org/duroktar/what-src?path=packages/what-src-plugin-babel&type=dev)

## Usage

Via .babelrc or babel-loader.
```json
{
  "plugins": [["module:@what-src/plugin", options]]
}
```

### options

options are defined by the type

```ts
type WhatSrcPluginOptions = {
  productionMode?: boolean;
  serverUrl?: string;
  dataTag?: string;
  globalCacheKey?: string;
  stopPropagation?: boolean;
  preventDefault?: boolean;
};
```

#### - productionMode: [boolean]
  - Set 'true' to enable running what-src in production mode (default: `false`)
#### - serverUrl: [string]
  - The full URL of the running @what-src/express server (default: `http://localhost:8018/__what_src`)
#### - dataTag: [string]
  - The name of the data tag used on elements (default: `data--what-src`)
#### - globalCacheKey: [string]
  - The global cache key name the click callback is keyed to (default: `__what-src-global-callback-key`)
#### - stopPropagation: [boolean]
  - Sets the stopPropagation property of the click event (default: `true`)
#### - preventDefault: [boolean]
  - Sets the preventDefault property of the click event (default: `true`)
