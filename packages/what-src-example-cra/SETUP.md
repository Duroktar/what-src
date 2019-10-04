# @what-src/plugin - Create React App Setup

Setup what-src in a CRA app in just 5 easy steps!

## Setup

### 1. Create App and Install dependencies

```bash
yarn create react-app my-app && cd my-app

yarn add -D react-app-rewired customize-cra concurrently

yarn add -D @what-src/babel-plugin @what-src/express
```

### 2. Create a `customize-cra` config file

```js
/* config-overrides.js */

const { useBabelRc, override } = require('customize-cra')

module.exports = override(
  useBabelRc()
);
```

### 3. Create a `babel` config
```js
/* .babelrc */

{
    "plugins": ["@what-src/babel-plugin"]
}
```

### 4. Update `npm` scripts

```js
/* package.json */

  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test --env=jsdom",
    "eject": "react-scripts eject",
    "dev:cra": "npm run develop",
    "dev:server": "what-src-express",
    "develop": "concurrently \"npm:start\" \"npm:dev:server\""
  },
```

### 5. Launch!

```bash
npm run develop
```

## Help

Refer to the [documentation](https://github.com/duroktar/what-src/tree/master).

## License

[MIT](https://opensource.org/licenses/MIT)
