import * as traverse from '@babel/traverse'
import * as WS from '@what-src/plugin-core'

export type BabelVisitor = {
  visitor: traverse.Visitor<WS.VisitorState>;
}
