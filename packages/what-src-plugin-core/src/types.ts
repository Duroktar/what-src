import * as traverse from '@babel/traverse'
import * as types from '@babel/types'

export type ServiceOptions = {
  options: WhatSrcPluginOptions;
  basedir: string;
  cache: SourceCache;
}

export type BabelPlugin = {
  visitor: traverse.Visitor<VisitorState>;
  pre?: (s: VisitorState) => void;
  post?: (s: VisitorState) => void;

}
export type BabelNodeTypes = typeof types
export type BabelPluginContext = { types: BabelNodeTypes }

export type WhatSrcConfiguration = Required<WhatSrcPluginOptions>

export type WhatSrcPluginOptions = {
  dataTag?: string;
  enableXkcdMode?: boolean;
  globalCacheKey?: string;
  importFrom?: string;
  importName?: string;
  preventDefault?: boolean;
  productionMode?: boolean;
  serverUrl?: string;
  stopPropagation?: boolean;
  useRemote?: boolean;
  blacklistedTags?: string[];
}

export type VisitorState = {
  filename: string;
  opts: WhatSrcPluginOptions;
  cache: { [k: string]: string };
  path: traverse.NodePath<types.JSXElement>;
}

export type SourceLocationStart = {
  col: number;
  basedir: string;
  line: number;
}

export type SourceLocationFullStart = {
  filename: string;
} & SourceLocationStart

/**
 * Keys are sequential numbers (cooerced to strings due to how js object keys
 * are stored) corresponding to some element in the dom with a matching tag. The
 * key value is the relative url to the file, line, and column as determined by
 * the visitor. The basedir for the relatively located url values are kept in
 * the __basedir property of the cache and should be sent along with the dto to
 * the backend when a click event is dispatched.
 *
 */
export type SourceCache = {
  [key: string]: string;
  __basedir: string;
}
