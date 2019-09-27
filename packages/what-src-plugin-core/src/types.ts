import * as traverse from '@babel/traverse'
import * as types from '@babel/types'

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
  filename: string,
  line: number,
  col: number,
}
