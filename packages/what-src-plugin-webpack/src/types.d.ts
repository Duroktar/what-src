export interface Logger {
  error(message?: any): void;
  warn(message?: any): void;
  info(message?: any): void;
}

export interface Options {
  logger?: Logger;
  silent?: boolean;
  productionMode?: boolean;
  endpoint?: string;
  port?: number;
  shh?: boolean;
}
