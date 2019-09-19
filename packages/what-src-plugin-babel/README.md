
# @what-src/babel-plugin

> what-src babel-plugin.

Check out the [packages folder](https://github.com/duroktar/what-src/tree/master/packages) for more information.

## Usage

Via .babelrc or babel-loader.
```json
{
  "plugins": [["module:@what-src/plugin", options]]
}
```

### options

options are defined by the type

```ts
type WhatSrcPluginOptions = {
  productionMode?: boolean;
  serverUrl?: string;
  dataTag?: string;
  globalCacheKey?: string;
  stopPropagation?: boolean;
  preventDefault?: boolean;
};
```

#### - productionMode: [boolean]
  - Set 'true' to enable running what-src in production mode (default: `false`)
#### - serverUrl: [string]
  - The full URL of the running @what-src/express server (default: `http://localhost:8018/__what_src`)
#### - dataTag: [string]
  - A [valid](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes#HTML_syntax) data attribute for tagging elements (default: `data-what-src`)
#### - globalCacheKey: [string]
  - The global cache key the click callback is keyed to (default: `__what-src-global-callback-key`)
#### - stopPropagation: [boolean]
  - Sets the stopPropagation property of the click event (default: `true`)
#### - preventDefault: [boolean]
  - Sets the preventDefault property of the click event (default: `true`)
