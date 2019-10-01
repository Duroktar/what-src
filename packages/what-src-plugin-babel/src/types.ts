import * as WS from '@what-src/plugin-core'
import { PluginObj } from '@babel/core'
import * as traverse from '@babel/traverse'
import * as types from '@babel/types'

export type BabelNodeTypes = typeof types

export type BabelPluginContext = { types: BabelNodeTypes }

export type BabelPluginState = {
  opts: {
    plugins: Array<{ key: string; options: {} }>
    root: string
  }
}

export type BabelPlugin = {
  visitor: traverse.Visitor<BabelVisitorState>;
  pre?: (s: BabelVisitorState) => void;
  post?: (s: BabelVisitorState) => void;

}

export type BabelVisitorState = {
  filename: string;
  opts: WS.WhatSrcPluginOptions;
  cache: { [k: string]: string };
  path: traverse.NodePath<types.JSXElement>;
  cwd: string;
  key: string;
  file: any;
}

export type BabelVisitor = PluginObj<BabelVisitorState>
