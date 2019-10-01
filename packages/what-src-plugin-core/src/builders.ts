import { string, number, object as yupObject } from 'yup'
import { SourceLocationStart } from './types'

/**
 * builder pattern for `SourceLocationFullStart` model.
 * validates on build and throw a yup error on failure.
 *
 * @export
 * @class SourceLocationBuilder
 */
export class SourceLocationBuilder {
  private column!: number
  private basedir!: string
  private line!: number

  public build(): SourceLocationStart {
    return this.validate({
      column: this.column,
      basedir: this.basedir,
      line: this.line,
    })
  }

  public validate(obj: any) {
    return this.schema.validateSync(obj)
  }

  public get schema() {
    return yupObject({
      basedir: string().max(1000),
      column: number().required(),
      line: number().min(1).max(1000 * 1000).required(),
    })
  }

  public withCol(value: number) {
    this.column = value
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
