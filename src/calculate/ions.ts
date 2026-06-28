export type HardnessUnit = 'dH' | 'fH' | 'clark'
export type AlkalinityUnit = 'mgL_hco3' | 'KH' | 'mmolL_ks43'

export interface WaterIons {
  ca: number
  mg: number
  hco3: number
  alkUnit: AlkalinityUnit
}

export interface WaterProfile {
  hardness: number
  alkalinity: number
}

export const CA_TO_CACO3 = 2.497
export const MG_TO_CACO3 = 4.118
export const DH_TO_CACO3 = 17.85
export const FH_TO_CACO3 = 10.0
export const CLARK_TO_CACO3 = 14.25

export const HCO3_TO_CACO3 = 0.8202
export const KH_TO_CACO3 = 17.85
export const KS43_TO_CACO3 = 50.04

export const hardnessToCaCO3 = (value: number, unit: HardnessUnit): number => {
  switch (unit) {
    case 'dH': return value * DH_TO_CACO3
    case 'fH': return value * FH_TO_CACO3
    case 'clark': return value * CLARK_TO_CACO3
    default: return value * DH_TO_CACO3
  }
}

export const alkalinityToCaCO3 = (value: number, unit: AlkalinityUnit): number => {
  switch (unit) {
    case 'mgL_hco3': return value * HCO3_TO_CACO3
    case 'KH': return value * KH_TO_CACO3
    case 'mmolL_ks43': return value * KS43_TO_CACO3
    default: return value * HCO3_TO_CACO3
  }
}

export const normaliseAlkalinity = (value: number, unit: AlkalinityUnit): number => {
  switch (unit) {
    case 'mgL_hco3': return value
    case 'KH': return (value * KH_TO_CACO3) / HCO3_TO_CACO3
    case 'mmolL_ks43': return value * 61.02
    default: return value
  }
}

export const ionsToProfile = (ions: Partial<WaterIons>): WaterProfile => {
  const ca = Number(ions.ca) || 0
  const mg = Number(ions.mg) || 0
  const hco3 = Number(ions.hco3) || 0
  return {
    hardness: ca * CA_TO_CACO3 + mg * MG_TO_CACO3,
    alkalinity: hco3 * HCO3_TO_CACO3
  }
}