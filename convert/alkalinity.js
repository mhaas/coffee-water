/**
 * Convert alkalinity from German hardness (°dH) to CaCO3 (ppm).
 *
 * @param {Number} germanHardness
 */
const alkalinityGHToCaCO3 = (germanHardness) => {
  return alkalinityHCO3ToCaCO3(alkalinityGHToHCO3(germanHardness))
}

exports.alkalinityGHToCaCO3 = alkalinityGHToCaCO3

/**
 * Convert alkalinity from German hardness (°dH) to HCO3 (mg/l).
 *
 * @param {Number} germanHardness
 */
const alkalinityGHToHCO3 = (germanHardness) => {
  return germanHardness / 0.04595
}

exports.alkalinityGHToHCO3 = alkalinityGHToHCO3

/**
 * Convert alkalinity from HCO3 (mg/l) to German hardness (°dH).
 *
 * @param {Number} hco3
 */
const alkalinityHCO3ToGH = (hCO3MgPerL) => {
  return hCO3MgPerL * 0.04595
}

exports.alkalinityHCO3ToGH = alkalinityHCO3ToGH

/**
 * Convert alkalinity from HCO3 (mg/l) to CaCO3 (ppm)
 *
 * @param {Number} hCO3MgPerL
 */
const alkalinityHCO3ToCaCO3 = (hCO3MgPerL) => {
  return hCO3MgPerL * 0.8202
}

exports.alkalinityHCO3ToCaCO3 = alkalinityHCO3ToCaCO3
