
# @what-src/webpack-plugin

[![npm](https://img.shields.io/npm/v/@what-src/webpack-plugin.svg?maxAge=3600)](https://www.npmjs.com/package/@what-src/webpack-plugin) [![Dependency Status](https://david-dm.org/duroktar/what-src.svg?path=packages/what-src-plugin-webpack)](https://david-dm.org/duroktar/what-src?path=packages/what-src-plugin-webpack) [![devDependency Status](https://david-dm.org/duroktar/what-src/dev-status.svg?path=packages/what-src-plugin-webpack)](https://david-dm.org/duroktar/what-src?path=packages/what-src-plugin-webpack&type=dev)

## Usage

Via .webpack.config.js

```ts
const { WhatSrcServerWebpackPlugin } = require('@what-src/plugin') // <- import plugin

...
module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
  },
  ...
plugins: [new WhatSrcServerWebpackPlugin(options)] // <- add plugin
...
}
```

### options

options are defined by the type

```ts
type Options = {
  productionMode?: boolean;
  host?: string;
  port?: number;
  endpoint?: string;
  shh?: boolean;
};
```

#### - productionMode: [boolean]
  - Enable running what-src in production mode (default: `false`)
#### - host: [string]
  - The host to serve on (default: `localhost`)
#### - port: [number]
  - The port to serve on (default: `8018`)
#### - endpoint: [string]
  - The url mount path of the @what-src/middleware (default: `__what_src`)
#### - shh: [boolean]
  - Turns off logging (default: `false`)
