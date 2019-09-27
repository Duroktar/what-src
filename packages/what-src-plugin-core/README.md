
# @what-src/plugin-core

> what-src core plugin package.

Check out the [packages folder](https://github.com/duroktar/what-src/tree/master/packages) for more information.

## Installation

```sh
npm install @what-src/plugin-core --save-dev
```

## Configuration

options are defined by the type

```ts
type WhatSrcPluginOptions = {
    productionMode?: boolean;
    enableXkcdMode?: boolean;
    useRemote?: boolean;
    serverUrl?: string;
    dataTag?: string;
    globalCacheKey?: string;
    stopPropagation?: boolean;
    preventDefault?: boolean;
    importFrom?: string;
    importName?: string;
};

type WhatSrcConfiguration = Required<WhatSrcPluginOptions>
```

#### - productionMode: [boolean]
  - Set 'true' to enable running what-src in production mode (default: `false`)
#### - enableXkcdMode: [boolean]
  - Set `true` to enable the click tracking feature and have your clicks (and
    everyone else's if `useRemote` is also used) count towards the total time
    saved number displayed on the [website](https://duroktar.github.io/what-src/)
    (default: `false`)
#### - useRemote: [boolean]
  - Set 'true' to enable remote mode which creates links to the source code on github (default: `false`)
  > Note: This requires your code to be in a valid `.git` directory. The generated
  > url will be based on the current branch at the time the code is compiled by
  > babel .
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
#### - importFrom: [string]
  - TODO (default: `what-src-cache.jss`)
#### - importName: [string]
  - TODO (default: `__WhatSrcGlobalVariable`)

## Full Documentation

We have auto-generated [typedoc](https://typedoc.org) what-src docs available [online here](https://duroktar.github.io/what-src/doc).

## License

[MIT](https://opensource.org/licenses/MIT)
