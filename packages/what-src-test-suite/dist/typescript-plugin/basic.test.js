"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts = tslib_1.__importStar(require("typescript"));
const typescript_plugin_1 = require("@what-src/typescript-plugin");
const compilerOptions = {
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.React,
    target: ts.ScriptTarget.ESNext,
    importHelpers: true,
};
const transformerOptions = {
    cacheLocOverride: '/CACHE_LOCATION/OVERRIDE',
    createCacheDir: false,
    createCacheFile: false,
};
const sourceText = `
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
it('works', () => {
    const result = ts.transpileModule(sourceText, {
        compilerOptions,
        transformers: { before: [typescript_plugin_1.createTransformer(transformerOptions)] },
    });
    expect(result.outputText).toMatchSnapshot();
});
//# sourceMappingURL=basic.test.js.map