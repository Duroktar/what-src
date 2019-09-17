"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const process = __importStar(require("process"));
const childProcess = __importStar(require("child_process"));
const chalk_1 = __importDefault(require("chalk"));
const hooks_1 = require("./hooks");
const logger_1 = require("./logger");
const PLUGIN_NAME = 'what-src-server-plugin';
class WhatSrcServerWebpackPlugin {
    constructor(options) {
        this.compiler = undefined;
        this.doneCallback = () => { };
        this.isRunning = false;
        this.WHAT_SRC_DAEMON_ENDPOINT = '__what_src';
        this.WHAT_SRC_DAEMON_PORT = '8018';
        this.WHAT_SRC_DAEMON_SHH = 'true';
        options = options || {};
        this.options = { ...options };
        this.logger = options.logger || logger_1.createLogger();
        this.silent = options.silent === true; // default false
        this.productionMode = options.productionMode === true; // default false
        // don't run in production unless 'productionMode' is set
        if (process.env.NODE_ENV === 'production' && !this.productionMode) {
            console.log('@what-src/webpack-plugin - running in production mode is disabled. ' +
                'To enable set the \'productionMode\' configuration option to true.');
        }
        ;
    }
    static getCompilerHooks(compiler) {
        return hooks_1.getWhatSrcWebpackPluginHooks(compiler);
    }
    apply(compiler) {
        if (process.env.NODE_ENV === 'production' && !this.productionMode) {
            return;
        }
        this.compiler = compiler;
        // validate logger
        if (this.logger) {
            if (!this.logger.error || !this.logger.warn || !this.logger.info) {
                throw new Error("Invalid logger object - doesn't provide `error`, `warn` or `info` method.");
            }
        }
        this.pluginStart();
        this.pluginStop();
        this.pluginCompile();
        this.pluginEmit();
        this.pluginDone();
    }
    pluginStart() {
        const run = (_compiler, callback) => {
            this.isRunning = false;
            callback();
        };
        const watchRun = (_compiler, callback) => {
            this.isRunning = true;
            callback();
        };
        if ('hooks' in this.compiler) {
            // webpack 4+
            this.compiler.hooks.run.tapAsync(PLUGIN_NAME, run);
            this.compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, watchRun);
        }
        else {
            // webpack 2 / 3
            this.compiler.plugin('run', run);
            this.compiler.plugin('watch-run', watchRun);
        }
    }
    pluginStop() {
        const watchClose = () => {
            this.killService();
        };
        const done = (_stats) => {
            if (!this.isRunning) {
                this.killService();
            }
        };
        if ('hooks' in this.compiler) {
            // webpack 4+
            this.compiler.hooks.watchClose.tap(PLUGIN_NAME, watchClose);
            this.compiler.hooks.done.tap(PLUGIN_NAME, done);
        }
        else {
            // webpack 2 / 3
            this.compiler.plugin('watch-close', watchClose);
            this.compiler.plugin('done', done);
        }
    }
    pluginCompile() {
        if ('hooks' in this.compiler) {
            // webpack 4+
            const WhatSrcHooks = WhatSrcServerWebpackPlugin.getCompilerHooks(this.compiler);
            this.compiler.hooks.compile.tap(PLUGIN_NAME, () => {
                WhatSrcHooks.serviceBeforeStart.callAsync(() => {
                    if (!this.service || !this.service.connected) {
                        this.spawnService();
                    }
                });
            });
        }
        else {
            // webpack 2 / 3
            this.compiler.plugin('compile', () => {
                this.compiler.applyPluginsAsync(hooks_1.legacyHookMap.serviceBeforeStart, () => {
                    if (!this.service || !this.service.connected) {
                        this.spawnService();
                    }
                });
            });
        }
    }
    pluginEmit() {
        const emit = (compilation, callback) => {
            callback();
        };
        if ('hooks' in this.compiler) {
            // webpack 4+
            this.compiler.hooks.emit.tapAsync(PLUGIN_NAME, emit);
        }
        else {
            // webpack 2 / 3
            this.compiler.plugin('emit', emit);
        }
    }
    pluginDone() {
        if ('hooks' in this.compiler) {
            // webpack 4+
            this.compiler.hooks.done.tap(PLUGIN_NAME, (_stats) => {
                this.doneCallback();
            });
        }
        else {
            // webpack 2 / 3
            this.compiler.plugin('done', () => {
                this.doneCallback();
            });
        }
    }
    spawnService() {
        const env = {
            ...process.env,
            CONTEXT: this.compiler.options.context,
            WHAT_SRC_DAEMON_SHH: this.WHAT_SRC_DAEMON_SHH,
            WHAT_SRC_DAEMON_PORT: this.WHAT_SRC_DAEMON_PORT,
            WHAT_SRC_DAEMON_ENDPOINT: this.WHAT_SRC_DAEMON_ENDPOINT,
        };
        this.service = childProcess.fork(path.resolve(__dirname, './service.js'), [], {
            env,
            execArgv: [].concat(/* this.nodeArgs */ []),
            stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
        });
        if ('hooks' in this.compiler) {
            // webpack 4+
            const WhatSrcHooks = WhatSrcServerWebpackPlugin.getCompilerHooks(this.compiler);
            WhatSrcHooks.serviceStart.call('serviceStart');
        }
        else {
            // webpack 2 / 3
            this.compiler.applyPlugins(hooks_1.legacyHookMap.serviceStart, 'serviceStart');
        }
        if (!this.silent && this.logger) {
            this.logger.info('server is running at ' +
                chalk_1.default.cyanBright.bold('http://localhost:' +
                    this.WHAT_SRC_DAEMON_PORT + '/' +
                    this.WHAT_SRC_DAEMON_ENDPOINT));
        }
        this.service.on('exit', (code, signal) => this.handleServiceExit(code, signal));
    }
    killService() {
        if (!this.service) {
            return;
        }
        try {
            this.service.kill();
            this.service = undefined;
        }
        catch (e) {
            if (this.logger && !this.silent) {
                this.logger.error(e);
            }
        }
    }
    handleServiceExit(_code, signal) {
        if (signal !== 'SIGABRT') {
            return;
        }
        // probably out of memory :/
        if (!this.silent && this.logger) {
            this.logger.error(chalk_1.default.red('what-src-server aborted - probably out of memory..'));
        }
    }
}
exports.WhatSrcServerWebpackPlugin = WhatSrcServerWebpackPlugin;
