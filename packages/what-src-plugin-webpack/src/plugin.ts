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
import { defaultOptions } from './options'

const PLUGIN_NAME = 'what-src-server-plugin'

class WhatSrcServerWebpackPlugin {
  public static getCompilerHooks(
    compiler: any
  ): Record<WhatSrcHooks, any> {
    return getWhatSrcWebpackPluginHooks(compiler)
  }

  public readonly options: Options

  private compiler: any = undefined;
  private doneCallback: () => void = () => {};
  private isRunning: boolean = false;
  private logger: Logger;
  private service?: childProcess.ChildProcess;

  constructor(options?: Partial<Options>) {
    options = options || ({} as Options)
    this.options = { ...defaultOptions, ...options }

    this.logger = options.logger || createLogger()

    if (this.showProductionWarning) {
      this.logger.info(
        '\n@what-src/webpack-plugin - running in production mode is disabled. ' +
        'To enable set the \'productionMode\' configuration option to true.'
      )
    };
  }

  public apply(compiler: any) {
    if (process.env.NODE_ENV === 'production' && !this.options.productionMode) {
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
      WHAT_SRC_DAEMON_HOST: JSON.stringify(this.options.host),
      WHAT_SRC_DAEMON_PORT: JSON.stringify(this.options.port),
      WHAT_SRC_DAEMON_ENDPOINT: JSON.stringify(this.options.endpoint),
      WHAT_SRC_DAEMON_EDITOR: JSON.stringify(this.options.editor),
      WHAT_SRC_DAEMON_SHH: JSON.stringify(this.options.shh),
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

    if (this.logger && !this.options.shh) {
      this.logger.info(
        'server is running at ' +
        chalk.cyanBright.bold(
          this.options.host + ':' +
            this.options.port + '/' +
            this.options.endpoint
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
      if (this.logger && !this.options.shh) {
        this.logger.error(e)
      }
    }
  }

  private handleServiceExit(_code: string | number, signal: string) {
    if (signal !== 'SIGABRT') {
      return
    }
    // probably out of memory :/
    if (this.logger && !this.options.shh) {
      this.logger.error(
        chalk.red(
          '@what-src/express aborted - probably out of memory..'
        )
      )
    }
  }

  private get mode() {
    return process.env.NODE_ENV
  }

  private get showProductionWarning() {
    const { productionMode, shh } = this.options
    return (this.mode === 'production' && !productionMode) && !shh
  }
}

export { WhatSrcServerWebpackPlugin }
