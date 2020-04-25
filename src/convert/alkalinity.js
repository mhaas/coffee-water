// Source: SCAE Water Chart Report

/**
 * Convert alkalinity from German hardness (°dH) to CaCO3 (ppm).
 *
 * @param {Number} germanHardness
 */
export const alkalinityGHToCaCO3 = (germanHardness) => {
  return alkalinityHCO3ToCaCO3(alkalinityGHToHCO3(germanHardness))
}

/**
 * Convert alkalinity from German hardness (°dH) to HCO3 (mg/l).
 *
 * @param {Number} germanHardness
 */
export const alkalinityGHToHCO3 = (germanHardness) => {
  return germanHardness / 0.04595
}

/**
 * Convert alkalinity from HCO3 (mg/l) to German hardness (°dH).
 *
 * @param {Number} hco3
 */
export const alkalinityHCO3ToGH = (hCO3MgPerL) => {
  return hCO3MgPerL * 0.04595
}

/**
 * Convert alkalinity from HCO3 (mg/l) to CaCO3 (ppm)
 *
 * @param {Number} hCO3MgPerL
 */
export const alkalinityHCO3ToCaCO3 = (hCO3MgPerL) => {
  return hCO3MgPerL * 0.8202
}
