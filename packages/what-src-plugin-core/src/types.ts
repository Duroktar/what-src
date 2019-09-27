import * as traverse from '@babel/traverse'
import * as types from '@babel/types'

export interface IResolver {
  emit(location: string): void;
  resolve(loc: GenerateJsxMetaDataArgs, sourcefile: string): string;
  getCache(): CacheType;
}

export type BabelPlugin = {
  visitor: traverse.Visitor<VisitorState>;
  pre?: (s: VisitorState) => void;
  post?: (s: VisitorState) => void;

};
export type BabelNodeTypes = typeof types
export type BabelPluginContext = { types: BabelNodeTypes };

export type WhatSrcOptions = Required<WhatSrcPluginOptions>

export type WhatSrcPluginOptions = {
  serverUrl?: string;
  dataTag?: string;
  productionMode?: boolean;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  globalCacheKey?: string;
  useRemote?: boolean;
  enableXkcdMode?: boolean;
  whatSrcStatsUrl?: string;
  importFrom?: string;
  importName?: string;
};

export type VisitorState = {
  filename: string;
  opts: WhatSrcPluginOptions;
  cache: { [k: string]: string };
  path: traverse.NodePath<types.JSXElement>;
};

export type GenerateJsxMetaDataArgs = {
  filename: string;
  line: number;
  col: number;
  basedir: string;
}

/**
 * Keys are sequential numbers (cooerced to strings due to how js object keys
 * are stored) corresponding to some element in the dom with a matching tag. The
 * key value is the relative url to the file, line, and column as determined by
 * the visitor. The basedir for the relatively located url values are kept in
 * the __basedir property of the cache and should be sent along with the dto to
 * the backend when a click event is dispatched.
 *
 */
export type CacheType = {
  [key: string]: string;
  __basedir: string;
};
