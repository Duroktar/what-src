
# @what-src/plugin

> what-src plugin bundle.

Check out the [packages folder](https://github.com/duroktar/what-src/tree/master/packages) for more information.

## Usage 

There's primarily two ways to use what-src in a project. For more custom usages
you may want to check out the docs for the particular plugin system you are
using.

> NOTE: Choose _only_ #1 if you are installing what-src into a CRA app, and
> _only_ #2 otherwise.

*1. Create React App*

See the guide [here](/packages/what-src-example-cra/SETUP.md)

*2. Babel & Webpack/Express*

First install the plugin from npm.

```sh
npm install @what-src/plugin --save-dev
```

> `@what-src/plugin` checks the `$EDITOR` environment variable (default:
> "vscode") to determine which editor to open your code in. Read
> [here](https://github.com/sindresorhus/env-editor) for more info.

### babel (required)

Via .babelrc or babel-loader.
```json
{
  "plugins": [
    "module:@what-src/plugin",
  ]
}
```

### Webpack-Dev-Server

```ts
$ webpack.config.js


const { WhatSrcServerWebpackPlugin } = require('@what-src/plugin') // <- import plugin

module.exports = {
  mode: 'development',
  entry: './src/index.jsx',
  output: {
    filename: 'bundle.js',
  },
  plugins: [new WhatSrcServerWebpackPlugin()] // <- add plugin
}
```

```json
$ package.json
{
  "scripts": {
    "develop": "webpack-dev-server"
  }
}
```

```sh
npm run develop
```

> NOTE: The server runs on port 8018 by default.

## License

[MIT](https://opensource.org/licenses/MIT)
