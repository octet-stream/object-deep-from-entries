// @ts-check

/**
 * Checks if value is NaN
 *
 * @param {unknown} value
 *
 * @returns value is NaN
 */
const isNaN = value => Number.isNaN(Number(value))

module.exports = isNaN
