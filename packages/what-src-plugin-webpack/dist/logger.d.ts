declare type LoggerOptions = {
    logLevel?: string;
    noInfo?: boolean;
    quiet?: boolean;
    logTime?: string | number;
};
export declare function createLogger(options?: LoggerOptions): any;
export {};
