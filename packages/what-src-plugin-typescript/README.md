
# @what-src/plugin

> what-src plugin bundle.

Check out the [packages folder](https://github.com/duroktar/what-src/tree/master/packages) for more information.

## Usage

First install the plugin from npm.

```sh
npm install @what-src/plugin --save-dev
```

> what-src respects your systems $EDITOR environment variable (default: "vscode")
> Read [here](https://github.com/sindresorhus/env-editor) for more info.

### babel (required)

Via .babelrc or babel-loader.
```json
{
  "plugins": [
    "module:@what-src/plugin",
    ...
  ]
}
```

### Webpack-Dev-Server

```ts
$ webpack.config.js


const { WhatSrcServerWebpackPlugin } = require('@what-src/plugin') // <- import plugin

...
module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
  },
  ...
plugins: [new WhatSrcServerWebpackPlugin()] // <- add plugin
...
}
```

```json
$ package.json
{
  ...
  "scripts": {
    ...
    "develop": "webpack-dev-server"
  },
  ...
}
```

```sh
npm run develop
```

> NOTE: The server runs on port 8018 by default.

## License

[MIT](https://opensource.org/licenses/MIT)
