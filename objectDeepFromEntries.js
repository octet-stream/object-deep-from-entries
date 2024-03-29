// @ts-check

const isPlainObject = require("./isPlainObject")
const isNumber = require("./isNumber")
const getTag = require("./getTag")
const isNaN = require("./isNaN")

const {isArray} = Array

/**
 * @param {[string | number, unknown][]} entries
 *
 * @returns {boolean}
 */
const hasNumKey = entries => entries.some(
  ([path]) => isNumber(path) || (isArray(path) && isNumber(path[0]))
)

/**
 * @param {any[] | Object.<string, any>} parent
 * @param {any[]} path
 * @param {any} value
 *
 * @return {any[] | Object.<string, any>}
 *
 * @api private
 */
function deepFromEntries(parent, path, value) {
  const key = path.shift()
  const current = isNaN(key) ? {} : []

  // TODO: Refactor that function to reduce code.
  if (!parent) {
    if (path.length === 0) {
      current[key] = value

      return current
    }

    current[key] = deepFromEntries(current[key], path, value)

    return current
  }

  if (isPlainObject(parent) || isArray(parent)) {
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
 * @param {any[]} entries
 *
 * @return {any[] | Object.<string, any>}
 *
 * @api public
 *
 * @example
 *
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
 */
function objectDeepFromEntries(entries) {
  if (!isArray(entries)) {
    throw new TypeError(
      `Expected an array of entries. Received ${getTag(entries)}`
    )
  }

  let res = {}
  let isCollection = false

  if (hasNumKey(entries)) {
    res = []
    isCollection = true
  }

  for (let [path, value] of entries) {
    if (isArray(path)) {
      // Copy entity path, because Array#shift() is used later.
      path = path.slice()
    } else {
      path = [path]
    }

    const root = path.shift()

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

  return res
}

module.exports = objectDeepFromEntries
module.exports.default = objectDeepFromEntries
