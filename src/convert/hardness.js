// Source: SCAE Water Chart Report

/**
 * Convert hardness from Ca (mg/L) and Mg (mg/l) to CaCO3 (ppm).
 *
 * @param {Number} calciumMgPerL
 * @param {Number} magnesiumMgPerL
 */
export const hardnessCaMgToCaCO3 = (calciumMgPerL, magnesiumMgPerL) => {
  return calciumMgPerL * 2.497 + magnesiumMgPerL * 4.118
}

/**
   * Convert hardness from German hardness (°dH) to CaCO3 (ppm).
   *
   * @param {Number} germanHardness
   */
export const hardnessGHToCaCO3 = (germanHardness) => {
  return germanHardness * 17.85
}
