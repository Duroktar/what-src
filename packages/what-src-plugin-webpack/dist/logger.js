"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createLogger(options = {}) {
    let level = options.logLevel || 'info';
    if (options.noInfo === true) {
        level = 'warn';
    }
    if (options.quiet === true) {
        level = 'silent';
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('webpack-log')({
        name: '@what-src/webpack-plugin',
        level,
        timestamp: options.logTime,
    });
}
exports.createLogger = createLogger;
