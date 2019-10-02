"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const babel = tslib_1.__importStar(require("@babel/core"));
const babel_plugin_1 = tslib_1.__importDefault(require("@what-src/babel-plugin"));
const example = `
import * as React from 'react'

class App extends React.Component {
  render() {
    return (
      <div className="first">
        <p>some p thing</p>
      </div>
    )
  }
}
`;
// function testcallback(...args) {
//   console.log(args)
// }
const res = babel.transformSync(example, {
    // metadataSubscribers: [testcallback],
    plugins: [
        '@babel/plugin-transform-runtime',
        [
            babel_plugin_1.default, {
                productionMode: true,
            },
        ],
    ],
    filename: 'dontmatter.tsx',
    presets: [
        '@babel/preset-env',
        '@babel/preset-react',
    ],
});
console.log(res);
//# sourceMappingURL=debug.js.map