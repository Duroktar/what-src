
# @what-src/express

> what-src express server.

Check out the [packages folder](https://github.com/duroktar/what-src/tree/master/packages) for more information.

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
