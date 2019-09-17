import { WhatSrcHooks } from './hooks';
import { Options } from './types';
declare class WhatSrcServerWebpackPlugin {
    static getCompilerHooks(compiler: any): Record<WhatSrcHooks, any>;
    readonly options: Partial<Options>;
    private compiler;
    private doneCallback;
    private isRunning;
    private logger;
    private productionMode;
    private service?;
    private silent;
    private WHAT_SRC_DAEMON_ENDPOINT;
    private WHAT_SRC_DAEMON_PORT;
    private WHAT_SRC_DAEMON_SHH;
    constructor(options?: Partial<Options>);
    apply(compiler: any): void;
    private pluginStart;
    private pluginStop;
    private pluginCompile;
    private pluginEmit;
    private pluginDone;
    private spawnService;
    private killService;
    private handleServiceExit;
}
export { WhatSrcServerWebpackPlugin };
