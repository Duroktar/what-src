type LoggerOptions = {
  logLevel?: string;
  noInfo?: boolean;
  quiet?: boolean;
  logTime?: string | number;
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createLogger(options: LoggerOptions = {}) {
  let level = options.logLevel || 'info'

  if (options.noInfo === true) {
    level = 'warn'
  }

  if (options.quiet === true) {
    level = 'silent'
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('webpack-log')({
    name: '@what-src/webpack-plugin',
    level,
    timestamp: options.logTime,
  })
}
