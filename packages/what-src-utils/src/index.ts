
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
 *object is undefined type-guard
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
export const getIn = (p: Array<string | number> | string, o: object, d?: any) => {
  if (!Array.isArray(p)) {
    p = p.split('.')
  }
  const res = p.reduce((xs, x) =>
    (xs && xs[x]) ? xs[x] : null, o)
  if (isNullOrUndefined(res)) return d
  else return res
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

/**
 * awaitable sleep function
 *
 * @param {number} ms
 */
// eslint-disable-next-line promise/param-names
export const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

/**
 * retry an operation until success w/ configurable rolllback and failure modes
 *
 * @param {Function} operation
 * @param {number} delay
 * @param {number} times
 */
export const retryOperation = (
  operation: any,
  delay: number,
  times: number,
) =>
  new Promise<any>((resolve, reject) => {
    return operation()
      .then(resolve)
      .catch((reason) => {
        if (times - 1 > 0) {
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay, times - 1))
            .then(resolve)
            .catch(reject)
        }
        return reject(reason)
      })
  })

/**
 * kinda like a with statement where the context is run inside a toggle state
 *
 * Example:
 * ```ts
 *    let toggleState = false
 *    const setToggleState = (nextToggleState: boolean) => {
 *      toggleState = nextToggleState
 *    }
 *    withOnOff(setToggleState, async() => {
 *      assert(toggleState === true)
 *      console.log('setToggleState is called with true before running code block')
 *    })
*     assert(toggleState === false)
*     console.log('and called with false after the block of code finishes')
 * ```
 * @param {(s: boolean) => void} toggle
 * @param {() => Promise<any>} body
 * @returns
 */
export const withOnOff = async(toggle: (s: boolean) => void, body: () => Promise<any>) => {
  toggle(true)
  await body()
  toggle(false)
  return true
}

/**
 * returns a function equivalent to the one passed that also logs a custom msg
 * before being applied
 *
 * @param {*} cb
 * @param {string} msg
 * @returns
 */
export const withPreLog = (cb: any, msg: string) => {
  return (...args: any[]) => {
    console.log(msg)
    // eslint-disable-next-line standard/no-callback-literal
    return cb(...args)
  }
}

type Otherwise<T> = { value: T, otherwise?: T }
type λIfArgs<T> = [Otherwise<T>] | [string, string]

/**
 * functional style if statement. returns value if value is truthy, otherwise
 * the default provided value or undefined if not provided
 *
 * > Note -
 * >
 * >*condition is automatically cooerced with the dbl-pound operator*
 * >
 * >ex: `if (!!condition) ... else ..`
 *
 * @template T
 * @param {*} condition
 * @param {λIfArgs<T>} {value, otherwise}
 * @returns
 */
export const λIf = <T>(condition: any, ...args: λIfArgs<T>) => {
  if (args.length === 2) {
    const [value, otherwise] = args
    return (condition) ? value : otherwise
  } else if (args.length === 1) {
    const { value, otherwise } = args[0] as Otherwise<T>
    return (condition) ? value : otherwise
  } else {
    return undefined
  }
}

type ResultType<T, E = Error> = {data: T; err: undefined} | {data: undefined; err: E}

/**
 * functional try statement.
 *
 *
 * Example:
 * ```ts
 *    const result = await λTry(() => schema.validate(req.body, options))
 *
 *    if (exists(result.err)) {
 *      console.error(result.err)
 *    }
 *
 *    assert(typeof result.data === typeof req.body)
 *    console.log('It works!')
 * ```
 * @template T
 * @template E
 * @param {() => Promise<T>} func
 */
export const λTry = async<T>(func: () => Promise<T>): Promise<ResultType<T>> => {
  const result = {} as ResultType<T>
  try {
    result.data = await func()
  } catch (err) {
    result.err = err
  }
  return result
}
