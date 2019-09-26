import * as traverse from '@babel/traverse'
import * as types from '@babel/types'

export type BabelPlugin = {
  visitor: traverse.Visitor<VisitorState>;
  pre?: (s: VisitorState) => void;
  post?: (s: VisitorState) => void;

};
export type BabelPluginContext = { types: typeof types };

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
};

export type VisitorState = {
  filename: string;
  options: WhatSrcPluginOptions;
  cache: { [k: string]: string };
  path: traverse.NodePath<JSXElement>;
};
