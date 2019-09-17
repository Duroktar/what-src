
# @what-src/webpack-plugin

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
  endpoint?: string;
  port?: number;
  shh?: boolean;
};
```

#### - productionMode: [boolean]
  - Set 'true' to enable running what-src in production mode.
#### - endpoint: [boolean]
  - TODO
#### - port: [boolean]
  - TODO
#### - shh: [boolean]
  - TODO
