export function isNullOrUndefined(object: unknown): object is null | undefined {
  return (object === null || object === undefined)
}

export const exists = <T>(object: T) => !isNullOrUndefined(object)

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
