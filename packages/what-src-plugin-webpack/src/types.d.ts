import { EditorType } from '@what-src/express'

export interface Logger {
  error(message?: any): void;
  warn(message?: any): void;
  info(message?: any): void;
}

export interface Options {
  logger?: Logger;
  editor?: EditorType;
  productionMode: boolean;
  host: string;
  port: number;
  endpoint: string;
  shh: boolean;
}
