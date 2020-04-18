// Source: SCAE Water Chart Report

/**
 * Convert hardness from Ca (mg/L) and Mg (mg/l) to CaCO3 (ppm).
 *
 * @param {Number} calciumMgPerL
 * @param {Number} magnesiumMgPerL
 */
const hardnessCaMgToCaCO3 = (calciumMgPerL, magnesiumMgPerL) => {
  return calciumMgPerL * 2.497 + magnesiumMgPerL * 4.118
}

exports.hardnessCaMgToCaCO3 = hardnessCaMgToCaCO3

/**
   * Convert hardness from German hardness (°dH) to CaCO3 (ppm).
   *
   * @param {Number} germanHardness
   */
const hardnessGHToCaCO3 = (germanHardness) => {
  return germanHardness * 17.85
}

exports.hardnessGHToCaCO3 = hardnessGHToCaCO3
