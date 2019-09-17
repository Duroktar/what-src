import * as path from 'path'
import * as process from 'process'
import * as childProcess from 'child_process'
import * as webpack from 'webpack'
import chalk from 'chalk'

import {
  getWhatSrcWebpackPluginHooks,
  legacyHookMap,
  WhatSrcHooks,
} from './hooks'
import { createLogger } from './logger'
import { Options, Logger } from './types'

const PLUGIN_NAME = 'what-src-server-plugin'

class WhatSrcServerWebpackPlugin {
  public static getCompilerHooks(
    compiler: any
  ): Record<WhatSrcHooks, any> {
    return getWhatSrcWebpackPluginHooks(compiler)
  }

  public readonly options: Partial<Options>

  private compiler: any = undefined;
  private doneCallback: () => void = () => {};
  private isRunning: boolean = false;
  private logger: Logger;
  private productionMode: boolean;
  private service?: childProcess.ChildProcess;
  private silent: boolean;
  private WHAT_SRC_DAEMON_ENDPOINT: string;
  private WHAT_SRC_DAEMON_PORT: number;
  private WHAT_SRC_DAEMON_SHH: boolean;

  constructor(options?: Partial<Options>) {
    options = options || ({} as Options)
    this.options = { ...options }

    this.logger = options.logger || createLogger()
    this.silent = options.silent === true // default false
    this.productionMode = options.productionMode === true // default false

    this.WHAT_SRC_DAEMON_ENDPOINT = options.endpoint || '__what_src'
    this.WHAT_SRC_DAEMON_PORT = options.port || 8018
    this.WHAT_SRC_DAEMON_SHH = options.shh === true

    // don't run in production unless 'productionMode' is set
    if (process.env.NODE_ENV === 'production' && !this.productionMode) {
      console.log(
        '@what-src/webpack-plugin - running in production mode is disabled. ' +
        'To enable set the \'productionMode\' configuration option to true.'
      )
    };
  }

  public apply(compiler: any) {
    if (process.env.NODE_ENV === 'production' && !this.productionMode) {
      return
    }

    this.compiler = compiler

    // validate logger
    if (this.logger) {
      if (!this.logger.error || !this.logger.warn || !this.logger.info) {
        throw new Error(
          "Invalid logger object - doesn't provide `error`, `warn` or `info` method."
        )
      }
    }

    this.pluginStart()
    this.pluginStop()
    this.pluginCompile()
    this.pluginEmit()
    this.pluginDone()
  }

  private pluginStart() {
    const run = (_compiler: webpack.Compiler, callback: () => void) => {
      this.isRunning = false
      callback()
    }

    const watchRun = (_compiler: webpack.Compiler, callback: () => void) => {
      this.isRunning = true
      callback()
    }

    if ('hooks' in this.compiler) {
      // webpack 4+
      this.compiler.hooks.run.tapAsync(PLUGIN_NAME, run)
      this.compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, watchRun)
    } else {
      // webpack 2 / 3
      this.compiler.plugin('run', run)
      this.compiler.plugin('watch-run', watchRun)
    }
  }

  private pluginStop() {
    const watchClose = () => {
      this.killService()
    }

    const done = (_stats: webpack.Stats) => {
      if (!this.isRunning) {
        this.killService()
      }
    }

    if ('hooks' in this.compiler) {
      // webpack 4+
      this.compiler.hooks.watchClose.tap(PLUGIN_NAME, watchClose)
      this.compiler.hooks.done.tap(PLUGIN_NAME, done)
    } else {
      // webpack 2 / 3
      this.compiler.plugin('watch-close', watchClose)
      this.compiler.plugin('done', done)
    }
  }

  private pluginCompile() {
    if ('hooks' in this.compiler) {
      // webpack 4+
      const WhatSrcHooks = WhatSrcServerWebpackPlugin.getCompilerHooks(
        this.compiler
      )
      this.compiler.hooks.compile.tap(PLUGIN_NAME, () => {
        WhatSrcHooks.serviceBeforeStart.callAsync(() => {
          if (!this.service || !this.service.connected) {
            this.spawnService()
          }
        })
      })
    } else {
      // webpack 2 / 3
      this.compiler.plugin('compile', () => {
        this.compiler.applyPluginsAsync(
          legacyHookMap.serviceBeforeStart,
          () => {
            if (!this.service || !this.service.connected) {
              this.spawnService()
            }
          }
        )
      })
    }
  }

  private pluginEmit() {
    const emit = (compilation: any, callback: () => void) => {
      callback()
    }

    if ('hooks' in this.compiler) {
      // webpack 4+
      this.compiler.hooks.emit.tapAsync(PLUGIN_NAME, emit)
    } else {
      // webpack 2 / 3
      this.compiler.plugin('emit', emit)
    }
  }

  private pluginDone() {
    if ('hooks' in this.compiler) {
      // webpack 4+
      this.compiler.hooks.done.tap(
        PLUGIN_NAME,
        (_stats: webpack.Stats) => {
          this.doneCallback()
        }
      )
    } else {
      // webpack 2 / 3
      this.compiler.plugin('done', () => {
        this.doneCallback()
      })
    }
  }

  private spawnService() {
    const env: { [key: string]: string | undefined } = {
      ...process.env,
      CONTEXT: this.compiler.options.context,
      WHAT_SRC_DAEMON_ENDPOINT: this.WHAT_SRC_DAEMON_ENDPOINT,
      WHAT_SRC_DAEMON_PORT: JSON.stringify(this.WHAT_SRC_DAEMON_PORT),
      WHAT_SRC_DAEMON_SHH: JSON.stringify(this.WHAT_SRC_DAEMON_SHH),
    }

    this.service = childProcess.fork(
      path.resolve(
        __dirname,
        './service.js'
      ),
      [],
      {
        env,
        execArgv: [].concat(/* this.nodeArgs */[]),
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      }
    )

    if ('hooks' in this.compiler) {
      // webpack 4+
      const WhatSrcHooks = WhatSrcServerWebpackPlugin.getCompilerHooks(
        this.compiler
      )
      WhatSrcHooks.serviceStart.call(
        'serviceStart',
      )
    } else {
      // webpack 2 / 3
      this.compiler.applyPlugins(
        legacyHookMap.serviceStart,
        'serviceStart',
      )
    }

    if (!this.silent && this.logger) {
      this.logger.info(
        'server is running at ' +
        chalk.cyanBright.bold(
          'http://localhost:' +
            this.WHAT_SRC_DAEMON_PORT + '/' +
            this.WHAT_SRC_DAEMON_ENDPOINT
        )
      )
    }

    this.service.on('exit', (code: string | number, signal: string) =>
      this.handleServiceExit(code, signal)
    )
  }

  private killService() {
    if (!this.service) {
      return
    }
    try {
      this.service.kill()
      this.service = undefined
    } catch (e) {
      if (this.logger && !this.silent) {
        this.logger.error(e)
      }
    }
  }

  private handleServiceExit(_code: string | number, signal: string) {
    if (signal !== 'SIGABRT') {
      return
    }
    // probably out of memory :/
    if (!this.silent && this.logger) {
      this.logger.error(
        chalk.red(
          'what-src-server aborted - probably out of memory..'
        )
      )
    }
  }
}

export { WhatSrcServerWebpackPlugin }
