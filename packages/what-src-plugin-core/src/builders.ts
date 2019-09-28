import { SourceLocationStart } from './types'

/**
 * builder pattern for `SourceLocationFullStart` model
 *
 * @export
 * @class SourceLocationBuilder
 */
export class SourceLocationBuilder {
  private col: number = 1;
  private basedir!: string;
  private line: number = 1;

  public build(): SourceLocationStart {
    return {
      col: this.col,
      basedir: this.basedir,
      line: this.line,
    }
  }

  public withCol(value: number) {
    this.col = value
    return this
  }

  public withBasedir(value: string) {
    this.basedir = value
    return this
  }

  public withLine(value: number) {
    this.line = value
    return this
  }
}
