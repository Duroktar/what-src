export const exists = <T>(obj: T): obj is NonNullable<T> => {
  return !isNullOrUndefined(obj)
}
export function isNullOrUndefined(obj: unknown): obj is null | undefined {
  return isNull(obj) || isUndefined(obj)
}
export const isNull = (obj: unknown): obj is null => {
  return obj === null
}
export const isUndefined = (obj: unknown): obj is undefined => {
  return obj === undefined
}

export const getIn = (p: Array<string | number> | string, o: object) => {
  if (!Array.isArray(p)) {
    p = p.split('.')
  }
  return p.reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : null, o)
}

export const capitalize = ([o, ...r]: string) => o.toUpperCase() + r.join('')
export const toCamelCase = (str: string) => {
  const [a, ...rest] = str.replace('_', '-').split('-')
  return [a, ...rest.map(capitalize)].join('')
}

export const isNodeEnvProduction = () => process.env.NODE_ENV === 'production'
