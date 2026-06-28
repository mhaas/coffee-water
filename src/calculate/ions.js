// @flow

export type HardnessUnit = 'dH' | 'fH' | 'clark'
export type AlkalinityUnit = 'mgL_hco3' | 'KH' | 'mmolL_ks43'

export type WaterIons = {
  ca: number,    // calcium mg/L
  mg: number,    // magnesium mg/L
  hco3: number,  // bicarbonate mg/L (always stored normalised to mg/L internally)
  alkUnit: AlkalinityUnit  // unit used when the value was last entered (UI display only)
}

export type WaterProfile = {
  hardness: number,   // mg/L CaCO3
  alkalinity: number  // mg/L CaCO3
}

// --- Conversion constants ---
// Hardness
export const CA_TO_CACO3 = 2.497      // Ca mg/L → mg/L CaCO3
export const MG_TO_CACO3 = 4.118      // Mg mg/L → mg/L CaCO3
export const DH_TO_CACO3 = 17.848     // °dH → mg/L CaCO3  (1 °dH = 10 mg/L CaO = 17.848 mg/L CaCO3)
export const FH_TO_CACO3 = 10.0       // °fH → mg/L CaCO3  (1 °fH = 10 mg/L CaCO3)
export const CLARK_TO_CACO3 = 14.254  // °e (Clark) → mg/L CaCO3  (1 grain/UK gallon)

// Alkalinity
export const HCO3_TO_CACO3 = 0.8197   // HCO3 mg/L → mg/L CaCO3  (= 50 / 61.02, MW ratio)
export const KH_TO_CACO3 = 17.848     // °KH → mg/L CaCO3  (same factor as °dH)
export const KS43_TO_CACO3 = 50.0     // mmol/L KS4.3 → mg/L CaCO3  (= MW(CaCO3) / 2)

// --- Hardness converter ---

// Convert a total hardness value in any supported unit to mg/L CaCO3.
export const hardnessToCaCO3 = (value: number, unit: HardnessUnit): number => {
  switch (unit) {
    case 'dH':    return value * DH_TO_CACO3
    case 'fH':    return value * FH_TO_CACO3
    case 'clark': return value * CLARK_TO_CACO3
    default:      return value * DH_TO_CACO3
  }
}

// --- Alkalinity converters ---

// Convert an alkalinity/bicarbonate value in any supported unit directly to mg/L CaCO3.
export const alkalinityToCaCO3 = (value: number, unit: AlkalinityUnit): number => {
  switch (unit) {
    case 'mgL_hco3':   return value * HCO3_TO_CACO3
    case 'KH':         return value * KH_TO_CACO3
    case 'mmolL_ks43': return value * KS43_TO_CACO3
    default:           return value * HCO3_TO_CACO3
  }
}

// Normalise an alkalinity value from any supported unit to mg/L HCO3 for internal storage.
// All presets and custom entries store hco3 in mg/L; this converts at the boundary.
export const normaliseAlkalinity = (value: number, unit: AlkalinityUnit): number => {
  switch (unit) {
    case 'mgL_hco3':   return value
    // °KH → mg/L CaCO3 → mg/L HCO3
    case 'KH':         return (value * KH_TO_CACO3) / HCO3_TO_CACO3
    // mmol/L × molar mass of HCO3 (61.02 g/mol) → mg/L HCO3
    case 'mmolL_ks43': return value * 61.02
    default:           return value
  }
}

// --- Primary profile converter ---

// Compute hardness + alkalinity in mg/L CaCO3 from canonical ion values.
// ca, mg, hco3 must all be in mg/L (use normaliseAlkalinity before calling if needed).
export const ionsToProfile = (ions: $Shape<WaterIons>): WaterProfile => {
  const ca = Number(ions.ca) || 0
  const mg = Number(ions.mg) || 0
  const hco3 = Number(ions.hco3) || 0
  return {
    hardness: ca * CA_TO_CACO3 + mg * MG_TO_CACO3,
    alkalinity: hco3 * HCO3_TO_CACO3
  }
}
