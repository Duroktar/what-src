
# @what-src/express

[![npm](https://img.shields.io/npm/v/@what-src/express.svg?maxAge=3600)](https://www.npmjs.com/package/@what-src/express) [![Dependency Status](https://david-dm.org/duroktar/what-src.svg?path=packages/what-src-express)](https://david-dm.org/duroktar/what-src?path=packages/what-src-express) [![devDependency Status](https://david-dm.org/duroktar/what-src/dev-status.svg?path=packages/what-src-express)](https://david-dm.org/duroktar/what-src?path=packages/what-src-express&type=dev)

## Usage

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

You can install the package globally as well..

```sh
npm install @what-src/express -g
...

what-src-express     # you can now run this command anywhere to start an instance
```

## Environment Variables

- EDITOR (default: optionally provided by system)
> NOTE: EDITOR takes priority over WHAT_SRC_DAEMON_EDITOR. (ie: 

- WHAT_SRC_DAEMON_HOST (default: `localhost`)
- WHAT_SRC_DAEMON_PORT (default: `8018`)
- WHAT_SRC_DAEMON_ENDPOINT (default: `__what_src`)
- WHAT_SRC_DAEMON_SHH (default: `false`)
- WHAT_SRC_DAEMON_EDITOR (default: `vscode`)
> NOTE: If EDITOR is set, WHAT_SRC_DAEMON_EDITOR is ignored)

## License

[MIT](https://opensource.org/licenses/MIT)
