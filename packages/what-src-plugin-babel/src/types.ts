import * as WS from '@what-src/plugin-core'
import { PluginObj } from '@babel/core'

export type BabelVisitor = PluginObj<WS.VisitorState>

export type PluginState = { opts: { plugins: Array<{ key: string; options: {} }> } }
