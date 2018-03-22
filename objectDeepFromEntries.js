const isNaN = require("./isNaN")
const getTag = require("./getTag")
const isNumber = require("./isNumber")
const isPlainObject = require("./isPlainObject")

const isArray = Array.isArray

const hasNumKey = entries => entries.find(
  ([path]) => isNumber(path) || (isArray(path) && isNumber(path[0]))
)

/**
 * @param {array|object} target
 * @param {array} path
 * @param {any} value
 *
 * @return {array|object}
 *
 * @api private
 */
function deepFromEntries(parent, parentKey, path, value) {
  const key = path.shift()
  const current = isNaN(key) ? {} : []

  // TODO: Refactor that function to reduce code.
  if (!parent) {
    if (path.length === 0) {
      current[key] = value

      return current
    }

    current[key] = deepFromEntries(current[key], key, path, value)

    return current
  }

  if (isPlainObject(parent) || isArray(parent)) {
    if (path.length === 0) {
      parent[key] = value

      return parent
    }

    parent[key] = deepFromEntries(parent[key], key, path, value)

    return parent
  }

  if (path.length === 0) {
    current[key] = value

    return current
  }

  current[key] = deepFromEntries(parent[key], key, path, value)

  return current
}

/**
 * Create an object from given entries
 *
 * @param {array} entries
 *
 * @return {object}
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

  for (const entry of entries) {
    let path = entry[0]
    const value = entry[1]

    if (!isArray(path)) {
      path = [path]
    }

    const root = path.shift()

    if (path.length === 0 && (isCollection && isNaN(root))) {
      res.push({[root]: value})
    } else if (path.length === 0) {
      res[root] = value
    } else if (isCollection && isNaN(root)) {
      res.push({[root]: deepFromEntries(res[root], root, path, value)})
    } else {
      res[root] = deepFromEntries(res[root], root, path, value)
    }
  }

  return res
}

module.exports = objectDeepFromEntries
module.exports.default = objectDeepFromEntries
