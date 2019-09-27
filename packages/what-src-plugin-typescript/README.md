
# @what-src/typescript-plugin

> what-src typescript [compiler plugin](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API).

Check out the [packages folder](https://github.com/duroktar/what-src/tree/master/packages)
for more information.

## Usage

First install the package from npm.

```sh
npm install @what-src/typescript-plugin --save-dev
```

### via Webpack (recommended)

Via webpack.config.ts (or .json, .js, ...).

```ts
import devserver from 'webpack-dev-server'
import webpack from 'webpack'
import { whatSrcServerTsLoaderPlugin } from '@what-src/plugin'
import { WhatSrcServerWebpackPlugin } from '@what-src/plugin'

const config: webpack.Configuration & devserver.Configuration = {
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: () => ({
                before: [whatSrcServerTsLoaderPlugin()],
              }),
            },
          },
        ],
      },
    ],
  },
  plugins: [new WhatSrcServerWebpackPlugin()],
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

### Planned Support

- [ttypescript](https://github.com/cevek/ttypescript)
- [custom compiler](https://levelup.gitconnected.com/writing-typescript-custom-ast-transformer-part-1-7585d6916819)

## Example

**Check out the [example project](https://github.com/duroktar/what-src/tree/master/packages/what-src-example-typescript)
for a more in depth setup.**

## License

[MIT](https://opensource.org/licenses/MIT)
