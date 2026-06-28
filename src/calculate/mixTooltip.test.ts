import { describe, it, expect } from 'vitest'
import { computeMixRatio, computeMixRatioFromPoint, formatRatio } from './mixTooltip'
import type { WaterPreset } from '../data/waterPresets'

const fakeWater = (alkalinity: number | undefined | null, hardness: number | undefined | null, name: string = 'Water'): WaterPreset => ({
  id: 'test',
  name,
  ions: { ca: 0, mg: 0, hco3: 0, alkUnit: 'mgL_hco3' },
  inputMode: 'ions',
  alkalinity: alkalinity as number,
  hardness: hardness as number,
})

describe('computeMixRatio', () => {
  const ro = fakeWater(0, 0, 'RO')
  const tap = fakeWater(100, 200, 'Tap')

  it('returns 0 at Water A position', () => {
    expect(computeMixRatio(0, ro, tap)).toBe(0)
  })

  it('returns 1 at Water B position', () => {
    expect(computeMixRatio(100, ro, tap)).toBe(1)
  })

  it('returns 0.5 at midpoint', () => {
    expect(computeMixRatio(50, ro, tap)).toBe(0.5)
  })

  it('returns 0.25 at quarter point', () => {
    expect(computeMixRatio(25, ro, tap)).toBe(0.25)
  })

  it('returns null when cursor is left of segment', () => {
    expect(computeMixRatio(-10, ro, tap)).toBeNull()
  })

  it('returns null when cursor is right of segment', () => {
    expect(computeMixRatio(110, ro, tap)).toBeNull()
  })

  it('works when Water B has lower alkalinity than Water A', () => {
    const result = computeMixRatio(75, tap, ro)
    expect(result).toBeCloseTo(0.25)
  })

  it('returns null when cursor is outside reversed segment', () => {
    expect(computeMixRatio(110, tap, ro)).toBeNull()
  })

  it('returns 0 when both waters have same alkalinity (vertical line)', () => {
    const a = fakeWater(50, 100)
    const b = fakeWater(50, 200)
    expect(computeMixRatio(50, a, b)).toBe(0)
  })

  it('returns null when alkalinity is undefined (bad preset data)', () => {
    const bad = fakeWater(undefined, 100)
    expect(computeMixRatio(50, bad, tap)).toBeNull()
  })

  it('returns null when alkalinity is null (bad preset data)', () => {
    const bad = fakeWater(null, 100)
    expect(computeMixRatio(50, bad, tap)).toBeNull()
  })
})

describe('computeMixRatioFromPoint', () => {
  const a = fakeWater(0, 0, 'RO')
  const b = fakeWater(100, 0, 'Tap')

  it('returns 0.5 when cursor is exactly on midpoint of segment', () => {
    expect(computeMixRatioFromPoint(50, 0, a, b)).toBeCloseTo(0.5)
  })

  it('returns 0 when cursor is on Water A end', () => {
    expect(computeMixRatioFromPoint(0, 0, a, b)).toBe(0)
  })

  it('returns 1 when cursor is on Water B end', () => {
    expect(computeMixRatioFromPoint(100, 0, a, b)).toBe(1)
  })

  it('returns null when cursor is far above the segment', () => {
    expect(computeMixRatioFromPoint(50, 100, a, b)).toBeNull()
  })

  it('returns null when cursor is far below the segment', () => {
    expect(computeMixRatioFromPoint(50, -100, a, b)).toBeNull()
  })

  it('returns null when cursor is beyond the left endpoint', () => {
    expect(computeMixRatioFromPoint(-50, 0, a, b)).toBeNull()
  })

  it('returns null when cursor is beyond the right endpoint', () => {
    expect(computeMixRatioFromPoint(150, 0, a, b)).toBeNull()
  })

  it('returns value within threshold above a diagonal segment', () => {
    const diagA = fakeWater(0, 0, 'A')
    const diagB = fakeWater(100, 100, 'B')
    expect(computeMixRatioFromPoint(50, 60, diagA, diagB)).not.toBeNull()
  })

  it('returns null when cursor is outside threshold above a diagonal segment', () => {
    const diagA = fakeWater(0, 0, 'A')
    const diagB = fakeWater(100, 100, 'B')
    expect(computeMixRatioFromPoint(50, 90, diagA, diagB)).toBeNull()
  })

  it('returns null when alkalinity is null', () => {
    const bad = fakeWater(null, 0)
    expect(computeMixRatioFromPoint(50, 0, bad, b)).toBeNull()
  })

  it('returns null when hardness is null', () => {
    const bad = fakeWater(0, null)
    expect(computeMixRatioFromPoint(50, 0, bad, b)).toBeNull()
  })
})

describe('formatRatio', () => {
  it('shows 100% Water A at ratio 0', () => {
    expect(formatRatio(0, 'RO', 'Tap')).toBe('100% RO')
  })

  it('shows 100% Water B at ratio 1', () => {
    expect(formatRatio(1, 'RO', 'Tap')).toBe('100% Tap')
  })

  it('shows 50/50 split at ratio 0.5', () => {
    expect(formatRatio(0.5, 'RO', 'Tap')).toBe('50% RO + 50% Tap')
  })

  it('shows 75/25 split at ratio 0.25', () => {
    expect(formatRatio(0.25, 'RO', 'Tap')).toBe('75% RO + 25% Tap')
  })

  it('rounds fractional percentages', () => {
    const result = formatRatio(1 / 3, 'RO', 'Tap')
    expect(result).toBe('67% RO + 33% Tap')
  })

  it('uses actual water names in output', () => {
    const result = formatRatio(0.5, 'Black Forest Still', 'Mannheim Käfertal')
    expect(result).toBe('50% Black Forest Still + 50% Mannheim Käfertal')
  })
})