
/**
 * typesafe version of isNotNullOrUndefined
 *
 * @template T
 * @param {T} obj
 * @returns {obj is NonNullable<T>}
 */
export const exists = <T>(obj: T): obj is NonNullable<T> => {
  return !isNullOrUndefined(obj)
}

/**
 * typescafe version of isNullOrUndefined to replace deprecated 'util' api
 *
 * @export
 * @param {unknown} obj
 * @returns {(obj is null | undefined)}
 */
export function isNullOrUndefined(obj: unknown): obj is null | undefined {
  return isNull(obj) || isUndefined(obj)
}

/**
 * object is null type-guard
 *
 * @param {unknown} obj
 * @returns {obj is null}
 */
export const isNull = (obj: unknown): obj is null => {
  return obj === null
}

/**
 *object is unddefined type-guard
 *
 * @param {unknown} obj
 * @returns {obj is undefined}
 */
export const isUndefined = (obj: unknown): obj is undefined => {
  return obj === undefined
}

/**
 * safe deep-get for objects. accepts dot path string or list of properies to
 * join for path
 *
 * @param {(Array<string | number> | string)} p
 * @param {object} o
 * @returns
 */
export const getIn = (p: Array<string | number> | string, o: object) => {
  if (!Array.isArray(p)) {
    p = p.split('.')
  }
  return p.reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : null, o)
}

/**
 * capitalized a word/string
 *
 * @param {string} [o, ...r]
 */
export const capitalize = ([o, ...r]: string) => o.toUpperCase() + r.join('')

/**
 * converts spaced, snake, or spinal case to camel case
 *
 * @param {string} str
 * @returns
 */
export const toCamelCase = (str: string) => {
  const [a, ...rest] = str.replace(' ', '-').replace('_', '-').split('-')
  return [a, ...rest.map(capitalize)].join('')
}

/**
 * true if NODE_ENV is set to `production`
 *
 */
export const isNodeEnvProduction = () => process.env.NODE_ENV === 'production'
