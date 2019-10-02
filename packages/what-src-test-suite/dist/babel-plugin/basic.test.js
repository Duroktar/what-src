"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const babel = tslib_1.__importStar(require("@babel/core"));
const babel_plugin_1 = tslib_1.__importDefault(require("@what-src/babel-plugin"));
const example = `
import * as React from 'react'

class TestClassComponent extends React.Component {
  render() {
    return (
      <div className="class-component">
        <p>some p thing</p>
      </div>
    )
  }
}

const TestFunctionalComponent = () => (
  <div className="functional-component">
    <p>some p thing</p>
  </div>
)

const TestMemoizedComponent = React.memo(() => (
  <div className="memoized-component">
    <p>some p thing</p>
  </div>
))
`;
const configuration = {
    cacheLocOverride: '/CACHE_LOCATION/OVERRIDE',
    createCacheDir: false,
    createCacheFile: false,
};
it('works', () => {
    const res = babel.transformSync(example, {
        plugins: [
            '@babel/plugin-transform-runtime',
            [babel_plugin_1.default, configuration],
        ],
        filename: 'testfile.ts',
        presets: [
            '@babel/preset-env',
            '@babel/preset-react',
        ],
    });
    expect(res.code).toMatchSnapshot();
});
//# sourceMappingURL=basic.test.js.map