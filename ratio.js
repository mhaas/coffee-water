// https://de.wikipedia.org/wiki/Mischungskreuz

/**
 *
 * Returns how many parts of the first water to add to one parts of
 * the second water to reach the desired target_measure.
 *
 *
 * @param {Number} firstMeasure
 * @param {Number} secondMeasure
 * @param {Number} targetMeasure
 */
const calculateParts = (firstMeasure, secondMeasure, targetMeasure) => {
  return (targetMeasure - secondMeasure) / (firstMeasure - targetMeasure)
}

exports.calculateParts = calculateParts

/**
 * Returns the relative amount of the water A of the final mixture.
 *
 * The returned value is not the dilution, i.e the amount of water
 * A to be added to one unit (liter) of water B.
 *
 * Instead, it is the ratio in the final mixture.
 *
 * Assuming this function returns 0.1, your final mixture will
 * need to contain 10% of water A and 90% of water B.
 *
 *
 * @param {Number} firstMeasure
 * @param {Number} secondMeasure
 * @param {Number} targetMeasure
 */
const calculateProportion = (firstMeasure, secondMeasure, targetMeasure) => {
  if ((firstMeasure < targetMeasure && secondMeasure < targetMeasure) || (firstMeasure > targetMeasure && secondMeasure > targetMeasure)) {
    return null
  }

  const deltaToFirstMeasure = Math.abs(firstMeasure - targetMeasure)
  const deltaToSecondMeasure = Math.abs(targetMeasure - secondMeasure)

  return deltaToSecondMeasure / (deltaToSecondMeasure + deltaToFirstMeasure)
}

exports.calculateProportion = calculateProportion
