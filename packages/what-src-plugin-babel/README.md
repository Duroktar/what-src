
# @what-src/babel-plugin

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
  - Set 'true' to enable running what-src in production mode.
#### - serverUrl: [string]
  - TODO
#### - dataTag: [string]
  - TODO
#### - globalCacheKey: [string]
  - TODO
#### - stopPropagation: [boolean]
  - TODO
#### - preventDefault: [boolean]
  - TODO
