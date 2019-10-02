"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_core_1 = require("@what-src/plugin-core");
const babel_plugin_1 = require("@what-src/babel-plugin");
const plugin = new babel_plugin_1.WhatSrcBabelPlugin();
describe('what-src babel-plugin configuration', () => {
    it('is stable', () => {
        expect(plugin.options).toMatchSnapshot();
    });
    it('has defaults', () => {
        expect(plugin.options).toEqual(plugin_core_1.defaultOptions);
    });
});
//# sourceMappingURL=options.test.js.map