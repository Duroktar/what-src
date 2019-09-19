
# @what-src/express-middleware

> what-src express middleware.

Check out the [packages folder](https://github.com/duroktar/what-src/tree/master/packages) for more information.

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
