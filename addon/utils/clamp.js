// @ts-check

/**
 * @param {number} value
 * @param {number} minimum
 * @param {number} maximum
 * @returns {number}
 */
export function clamp(value, minimum, maximum) {
  if (value < minimum) {
    value = minimum;
  }

  if (value > maximum) {
    value = maximum;
  }

  return value;
}
