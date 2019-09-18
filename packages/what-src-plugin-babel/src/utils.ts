export function isNullOrUndefined(object: unknown): object is null | undefined {
  return (object === null || object === undefined)
}

export const getIn = (p: Array<string | number> | string, o: object) => {
  if (!Array.isArray(p)) {
    p = p.split('.')
  }
  return p.reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : null, o)
}
