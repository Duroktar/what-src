"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = __importDefault(require("@babel/template"));
const utils_1 = require("./utils");
const defaultOptions = {
    serverUrl: 'http://localhost:8018/__what_src',
    dataTag: 'data--what-src',
    productionMode: false,
    stopPropagation: true,
    preventDefault: true,
    globalCacheKey: '__what-src-global-callback-key',
};
let nextId = 1;
let disabled = false;
exports.babelPlugin = ({ types: t }) => ({
    pre() {
        const opts = Object.assign({}, defaultOptions, this.opts);
        if (!disabled && process.env.NODE_ENV === 'production' && !opts.productionMode) {
            console.log('@what-src/babel-plugin - running in production mode is disabled. ' +
                'To enable set the \'productionMode\' configuration option to true.');
            disabled = true;
        }
        ;
        this.cache = {};
    },
    post(state) {
        if (disabled)
            return;
        const opts = Object.assign({}, defaultOptions, this.opts);
        const eventListener = template_1.default.statement(`
      try {
        const cache = JSON.parse(%%cache%%);
        window[%%globalCacheKey%%] = function (e) {
          if (e.metaKey) {
            if (%%stopPropagation%%) e.stopPropagation()
            if (%%preventDefault%%) e.preventDefault()
            const xhr = new XMLHttpRequest();
            xhr.open('POST', %%serverUrl%%, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            const dataset = cache[e.path[0].dataset['WhatSrc']]
            if (typeof dataset !== 'undefined') xhr.send(dataset);
          }
        }
        window.document.removeEventListener('click', window[%%globalCacheKey%%])
        window.document.addEventListener('click', window[%%globalCacheKey%%])
      } catch {}
    `);
        const rawCache = JSON.stringify(this.cache);
        const ast = eventListener({
            globalCacheKey: t.stringLiteral(opts.globalCacheKey),
            serverUrl: t.stringLiteral(opts.serverUrl),
            cache: t.stringLiteral(rawCache),
            stopPropagation: t.booleanLiteral(opts.stopPropagation),
            preventDefault: t.booleanLiteral(opts.preventDefault),
        });
        state.path.node.body.push(ast);
    },
    visitor: {
        JSXElement: {
            enter(path, state) {
                if (disabled || utils_1.isNullOrUndefined(path.node.openingElement.loc))
                    return;
                const opts = Object.assign({}, defaultOptions, state.opts);
                const meta = path.node.openingElement.loc.start;
                const metaData = JSON.stringify({
                    filename: state.filename,
                    line: meta.line,
                    column: meta.column + 1,
                });
                const attr = t.jsxAttribute(t.jsxIdentifier(opts.dataTag), t.stringLiteral(nextId.toString()));
                path.node.openingElement.attributes.push(attr);
                this.cache[nextId] = metaData;
                nextId++;
            },
        },
    },
});
