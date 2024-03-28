import {isPlainObject} from "./utils/isPlainObject.js"
import {isNumber} from "./utils/isNumber.js"
import {isNaN} from "./utils/isNaN.js"

export type EntryKey = string | number

export type Entry = [EntryKey | EntryKey[], unknown]

export type Input = Entry[]

export type UnknownObject = Record<EntryKey, unknown>

export type DefaultResult = UnknownObject | unknown[]

const hasNumKey = (entries: Input): boolean => entries.some(
  ([path]) => isNumber(path) || (Array.isArray(path) && isNumber(path[0]))
)

/**
 * @private
 */
function deepFromEntries(parent: any, path: any, value: any): any {
  const key: any = path.shift()
  const current: DefaultResult = isNaN(key) ? {} : []

  // TODO: Refactor that function to reduce code.
  if (!parent) {
    if (path.length === 0) {
      current[key] = value

      return current
    }

    current[key] = deepFromEntries(current[key], path, value)

    return current
  }

  if (isPlainObject(parent) || Array.isArray(parent)) {
    if (path.length === 0) {
      parent[key] = value

      return parent
    }

    parent[key] = deepFromEntries(parent[key], path, value)

    return parent
  }

  if (path.length === 0) {
    current[key] = value

    return current
  }

  current[key] = deepFromEntries(parent[key], path, value)

  return current
}

/**
 * Create an object from given entries
 *
 * @public
 *
 * @example
 *
 * ```js
 * const entries = [
 *   [
 *     ["name"], "John Doe"
 *   ],
 *   [
 *     ["age"], 25
 *   ],
 *   [
 *     ["gender"], "Male"
 *   ]
 * ]
 *
 * objectDeepFromEntries(entries)
 * // -> {name: "John Doe", age: 25, gender: "Male"}
 * ```
 */
export function objectDeepFromEntries<TResult extends DefaultResult = UnknownObject>(
  entries: Input
): TResult {
  if (!Array.isArray(entries)) {
    throw new TypeError("Expected an array of entries.")
  }

  let res: any = {}
  let isCollection = false

  if (hasNumKey(entries)) {
    res = []
    isCollection = true
  }

  for (let [path, value] of entries) {
    if (Array.isArray(path)) {
      // Copy entity path, because Array#shift() is used later.
      path = path.slice()
    } else {
      path = [path]
    }

    const root: any = path.shift()

    if (path.length === 0 && (isCollection && isNaN(root))) {
      res.push({[root]: value})
    } else if (path.length === 0) {
      res[root] = value
    } else if (isCollection && isNaN(root)) {
      res.push({[root]: deepFromEntries(res[root], path, value)})
    } else {
      res[root] = deepFromEntries(res[root], path, value)
    }
  }

  return res as TResult
}
