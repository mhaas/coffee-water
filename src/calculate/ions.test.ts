import { describe, it, expect } from 'vitest'
import {
  ionsToProfile,
  hardnessToCaCO3,
  alkalinityToCaCO3,
  normaliseAlkalinity
} from './ions'

describe('ionsToProfile', () => {
  it('Volvic: Ca 13, Mg 9, HCO3 80', () => {
    expect(ionsToProfile({ ca: 13, mg: 9, hco3: 80 }).hardness).toBeCloseTo(70, 0)
    expect(ionsToProfile({ ca: 13, mg: 9, hco3: 80 }).alkalinity).toBeCloseTo(66, 0)
  })

  it('Evian: Ca 80, Mg 26, HCO3 360', () => {
    expect(ionsToProfile({ ca: 80, mg: 26, hco3: 360 }).hardness).toBeCloseTo(307, 0)
    expect(ionsToProfile({ ca: 80, mg: 26, hco3: 360 }).alkalinity).toBeCloseTo(295, 0)
  })

  it('pure RO: all zeros', () => {
    expect(ionsToProfile({ ca: 0, mg: 0, hco3: 0 })).toEqual({ hardness: 0, alkalinity: 0 })
  })

  it('missing mg treated as 0', () => {
    expect(ionsToProfile({ ca: 13, hco3: 80 }).hardness).toBeCloseTo(32.5, 0)
  })
})

describe('hardnessToCaCO3', () => {
  it('°dH: 19.7 → 352 (Mannheim Käfertal cross-check)', () => {
    expect(hardnessToCaCO3(19.7, 'dH')).toBeCloseTo(352, 0)
  })

  it('°fH: 35.2 → 352 (1 °fH = 10 mg/L CaCO3)', () => {
    expect(hardnessToCaCO3(35.2, 'fH')).toBeCloseTo(352, 0)
  })

  it('°e (Clark): 24.7 → 352 (1 °e = 14.254 mg/L CaCO3)', () => {
    expect(hardnessToCaCO3(24.7, 'clark')).toBeCloseTo(352, 0)
  })
})

describe('alkalinityToCaCO3', () => {
  it('HCO3 mg/L: 80 → 66 (Volvic)', () => {
    expect(alkalinityToCaCO3(80, 'mgL_hco3')).toBeCloseTo(66, 0)
  })

  it('°KH: 16.4 → 293 (Wiesloch Stadtgebiet cross-check)', () => {
    expect(alkalinityToCaCO3(16.4, 'KH')).toBeCloseTo(293, 0)
  })

  it('mmol/L KS4.3: 5.52 → 276 (Walldorf cross-check)', () => {
    expect(alkalinityToCaCO3(5.52, 'mmolL_ks43')).toBeCloseTo(276, 0)
  })
})

describe('normaliseAlkalinity', () => {
  it('mgL_hco3: passthrough', () => {
    expect(normaliseAlkalinity(80, 'mgL_hco3')).toBe(80)
  })

  it('°KH: 16.4 → ~357 mg/L HCO3', () => {
    expect(normaliseAlkalinity(16.4, 'KH')).toBeCloseTo(357, 0)
  })

  it('mmolL_ks43: 5.52 → ~337 mg/L HCO3', () => {
    expect(normaliseAlkalinity(5.52, 'mmolL_ks43')).toBeCloseTo(337, 0)
  })
})