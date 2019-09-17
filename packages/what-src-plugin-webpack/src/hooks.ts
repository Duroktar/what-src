import * as webpack from 'webpack'
import { AsyncSeriesHook, SyncHook } from 'tapable'

export type WhatSrcHooks =
  | 'serviceBeforeStart'
  | 'cancel'
  | 'serviceStartError'
  | 'waiting'
  | 'serviceStart'
  | 'receive'
  | 'emit'
  | 'done';
type WhatSrcHookMap = Record<
  WhatSrcHooks,
  SyncHook | AsyncSeriesHook
>;
type WhatSrcLegacyHookMap = Record<WhatSrcHooks, string>;

const compilerHookMap = new WeakMap<webpack.Compiler, WhatSrcHookMap>()

export const legacyHookMap: WhatSrcLegacyHookMap = {
  serviceBeforeStart: 'what-src-service-before-start',
  cancel: 'what-src-cancel',
  serviceStartError: 'what-src-service-start-error',
  waiting: 'what-src-waiting',
  serviceStart: 'what-src-service-start',
  receive: 'what-src-receive',
  emit: 'what-src-emit',
  done: 'what-src-done',
}

function createWhatSrcWebpackPluginHooks(): WhatSrcHookMap {
  return {
    serviceBeforeStart: new AsyncSeriesHook([]),
    cancel: new SyncHook(['cancellationToken']),
    serviceStartError: new SyncHook(['error']),
    waiting: new SyncHook(['hasTsLint']),
    serviceStart: new SyncHook([
      'tsconfigPath',
      'tslintPath',
      'watchPaths',
      'workersNumber',
      'memoryLimit',
    ]),
    receive: new SyncHook(['diagnostics', 'lints']),
    emit: new SyncHook(['diagnostics', 'lints', 'elapsed']),
    done: new SyncHook(['diagnostics', 'lints', 'elapsed']),
  }
}

export function getWhatSrcWebpackPluginHooks(compiler: webpack.Compiler) {
  let hooks = compilerHookMap.get(compiler)
  if (hooks === undefined) {
    hooks = createWhatSrcWebpackPluginHooks()
    compilerHookMap.set(compiler, hooks)
  }
  return hooks
}
