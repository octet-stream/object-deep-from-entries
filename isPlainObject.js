// @ts-check

const getTag = require("./getTag")

const getPrototype = Object.getPrototypeOf
const objectCtorString = Object.toString()

/**
 * @param {unknown} value
 *
 * @return {value is Object.<string, any>}
 */
function isPlainObject(value) {
  if (getTag(value) !== "object") {
    return false
  }

  const pp = getPrototype(value)

  if (pp === null || pp === void 0) {
    return true
  }

  const Ctor = pp.constructor && pp.constructor.toString()

  return Ctor === objectCtorString
}

module.exports = isPlainObject
