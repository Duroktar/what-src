import * as webpack from 'webpack';
import { AsyncSeriesHook, SyncHook } from 'tapable';
export declare type WhatSrcHooks = 'serviceBeforeStart' | 'cancel' | 'serviceStartError' | 'waiting' | 'serviceStart' | 'receive' | 'emit' | 'done';
declare type WhatSrcLegacyHookMap = Record<WhatSrcHooks, string>;
export declare const legacyHookMap: WhatSrcLegacyHookMap;
export declare function getWhatSrcWebpackPluginHooks(compiler: webpack.Compiler): Record<WhatSrcHooks, SyncHook<any, any, any> | AsyncSeriesHook<any, any, any>>;
export {};
