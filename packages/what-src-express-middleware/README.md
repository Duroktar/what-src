
# @what-src/express-middleware

[![npm](https://img.shields.io/npm/v/@what-src/express-middleware.svg?maxAge=3600)](https://www.npmjs.com/package/@what-src/express-middleware) [![Dependency Status](https://david-dm.org/duroktar/what-src.svg?path=packages/what-src-express-middleware)](https://david-dm.org/duroktar/what-src?path=packages/what-src-express-middleware) [![devDependency Status](https://david-dm.org/duroktar/what-src/dev-status.svg?path=packages/what-src-express-middleware)](https://david-dm.org/duroktar/what-src?path=packages/what-src-express-middleware&type=dev)

## Usage

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

## Environment Variables

- WHAT_SRC_MIDDLEWARE_SHH (default: `false`)

## License

[MIT](https://opensource.org/licenses/MIT)
