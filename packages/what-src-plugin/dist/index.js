"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const babel_plugin_1 = __importDefault(require("@what-src/babel-plugin"));
const webpack_plugin_1 = __importDefault(require("@what-src/webpack-plugin"));
exports.WhatSrcServerWebpackPlugin = webpack_plugin_1.default;
exports.default = babel_plugin_1.default;
