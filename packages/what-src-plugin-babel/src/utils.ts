export function isNullOrUndefined(object: unknown): object is null | undefined {
  return (object === null || object === undefined)
}
