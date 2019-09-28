
# @what-src/webpack-plugin

> what-src webpack-plugin.

Check out the [packages folder](https://github.com/duroktar/what-src/tree/master/packages) for more information.

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

<br />

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

## License

[MIT](https://opensource.org/licenses/MIT)
