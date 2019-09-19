<p align="center">
  <a href="https://github.com/duroktar/what-src">
    <img alt="what-src" src="https://raw.githubusercontent.com/duroktar/what-src-logo/master/what-src.png" width="546">
  </a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@what-src/plugin"><img alt="npm Downloads" src="https://img.shields.io/npm/dm/@what-src/plugin.svg?maxAge=43200"></a>
  <a href="https://david-dm.org/duroktar/what-src?type=dev" title="devDependencies status"><img src="https://david-dm.org/duroktar/what-src/dev-status.svg"/></a>
  <a href="https://lerna.js.org/"><img alt="Managed By Lerna" src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg"></a>
</p>

`@what-src/plugin` is a tool for developers that puts the code for every element
on the page, a single click away.

[Check out the demo](https://github.com/Duroktar/what-src-logo/tree/master/demo)

## Intro

Getting familiar with a new codebase can be challenging. Even *if*
you've been working around in it for a while, once any project grows past a
certain size you'll inevitably find yourself **grepping around** to find some
particular spot.. in some **long forgotten file**.. to make some quick
change to something ***you were just looking at in the browser!*** It gets
annoying, and that time adds up pretty quickly (see relevant
[xkcd](https://xkcd.com/1205/)). 

*But we can do better than that.*

Now ***every single element*** on the page is only **one click away** from
being inside your editor, **at the line it was declared**! Nice.

> System hotkey must be pressed to register page clicks. See configuration
> section below. 

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

***Now pick from one of the following steps***

### Webpack-Dev-Server (Option 1: easiest)

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

> If you're already using babel and webpack-dev-server this is the recommended
> approach, as the server lifetime will be automatically managed for you. 

> NOTE: The server runs on port 8018 by default.

### Express  (Option 2: still pretty easy)

```sh
npm install @what-src/express --save-dev
```

```json
$ package.json
{
  ...
  "scripts": {
    ...
    "start:what-src": "what-src-express"
  },
  ...
}

$ npm run start:what-src
```

> The server will run indefinitely on port 8018 until stopped with the ctrl+c
> command.

### Express-Middleware (Option 3: Most coolest)

```sh
npm install @what-src/express-middleware --save-dev
```

```ts
$ server.js

const app = require('express')()
app.use(bodyParser.json())
...
app.post('/__what_src', require('@what-src/express-middleware'))
...
app.listen(port, () => {
  console.log('what-src - Middleware service started!')
})
```

> If you're using the plugin like this than you likely already know what you're
> doing. See the babel plugin options below for configuring the request options
> sent from the client to handle clicks.

## Configuration

### Global Hotkey

***The hotkey must be pressed for page clicks to trigger the plugin.***

- Windows: <kbd>WinKey</kbd> + Left Click
- MacOS: <kbd>⌘ Command</kbd> + Left Click

### Other options

See more configuration options in the
[@what-src/babel-plugin](/packages/what-src-plugin-babel/README.md) and
[@what-src/webpack-plugin](/packages/what-src-plugin-webpack/README.md) packages.

## What is it?

`@what-src/plugin` consists of two parts. A babel-plugin and a web-server*
(`@what-src/babel-plugin` and `@what-src/webpack-plugin` respectively).

*the web-server is also available as an `express-middleware` module, or a
complete standalone application.

Opening a local filepath from javascript in your browser is not possible, so the
`@what-src/express` server is responsible for opening the requested file in the
correct editor on your system at the correct location. To do this it uses the
`open-editor` package from [@sindresorhus](https://github.com/sindresorhus)
which works on multiple platforms, is well maintained, and highly configurable.

The `@what-src/babel-plugin` tags any html elements it comes across in your code
with a key to a cache line containing the necessary data, which can then be sent
to the server whenever a "valid" click event is detected (ie: with the hotkey
pressed). The cache key for each element is stored in its `data--what-src`
attribute and is unique across all nodes.

The actual click events are detected using a global listener on the
`window.document` object which then sends a native xhr request to the server
with the relevant cache line for the clicked element.

## Why?

It seemed like a good idea and I was bored. Mix that with some free time from
the day job and this is the result.

## FAQ

### Are there any examples?

Check out the
[@what-src/testing-basic](/packages/what-src-example-basic).

### Want to report a bug or request a feature?

Please read through our [CONTRIBUTING.md](CONTRIBUTING.md) and fill out the
issue template at
[what-src/issues](https://github.com/duroktar/what-src/issues)!

### How is the repo structured?

The What-Src repo is managed as a monorepo that is composed of many [npm
packages](packages/README.md) and takes inspiration from the
[@babel/babel](https://github.com/babel/babel) project on
[Github](https://github.com).

## License

[MIT](https://opensource.org/licenses/MIT)
