const isNaN = require("./isNaN")

const isArray = Array.isArray

/**
 * @param {array|object} target
 * @param {array} path
 * @param {any} value
 *
 * @return {array|object}
 *
 * @api private
 */
function deepFromEntries(target, path, value) {
  const currentPath = path.shift()
  const curr = isNaN(currentPath) ? {} : []

  if (!target) {
    if (path.length === 0) {
      curr[currentPath] = value

      return curr
    }

    curr[currentPath] = deepFromEntries(curr[currentPath], path, value)

    return curr
  }

  if (path.length === 0) {
    target[currentPath] = value

    return target
  }

  target[currentPath] = deepFromEntries(target[currentPath], path, value)

  return target
}

/**
 * Create an object from given entries
 *
 * @param {array} entries
 *
 * @return {object}
 *
 * @api private
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
  const res = {}

  for (const entry of entries) {
    let path = entry[0]
    const value = entry[1]

    if (!isArray(path)) {
      path = [path]
    }

    const root = path.shift()

    if (path.length < 1) {
      res[root] = value
    } else {
      res[root] = deepFromEntries(res[root], path, value)
    }
  }

  return res
}

module.exports = objectDeepFromEntries
