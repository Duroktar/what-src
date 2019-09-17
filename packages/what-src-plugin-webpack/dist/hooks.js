"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tapable_1 = require("tapable");
const compilerHookMap = new WeakMap();
exports.legacyHookMap = {
    serviceBeforeStart: 'what-src-service-before-start',
    cancel: 'what-src-cancel',
    serviceStartError: 'what-src-service-start-error',
    waiting: 'what-src-waiting',
    serviceStart: 'what-src-service-start',
    receive: 'what-src-receive',
    emit: 'what-src-emit',
    done: 'what-src-done',
};
function createWhatSrcWebpackPluginHooks() {
    return {
        serviceBeforeStart: new tapable_1.AsyncSeriesHook([]),
        cancel: new tapable_1.SyncHook(['cancellationToken']),
        serviceStartError: new tapable_1.SyncHook(['error']),
        waiting: new tapable_1.SyncHook(['hasTsLint']),
        serviceStart: new tapable_1.SyncHook([
            'tsconfigPath',
            'tslintPath',
            'watchPaths',
            'workersNumber',
            'memoryLimit',
        ]),
        receive: new tapable_1.SyncHook(['diagnostics', 'lints']),
        emit: new tapable_1.SyncHook(['diagnostics', 'lints', 'elapsed']),
        done: new tapable_1.SyncHook(['diagnostics', 'lints', 'elapsed']),
    };
}
function getWhatSrcWebpackPluginHooks(compiler) {
    let hooks = compilerHookMap.get(compiler);
    if (hooks === undefined) {
        hooks = createWhatSrcWebpackPluginHooks();
        compilerHookMap.set(compiler, hooks);
    }
    return hooks;
}
exports.getWhatSrcWebpackPluginHooks = getWhatSrcWebpackPluginHooks;
