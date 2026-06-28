import { describe, it, expect, beforeEach } from 'vitest'
import reducer, { setPreset, updateIonValue, updateDirectValue } from './waterSlicer'
import { waterPresets } from '../../data/waterPresets'
import type { WaterPreset } from '../../data/waterPresets'

describe('waterSlicer actions & reducer', () => {
  let initialState: { waterA: WaterPreset; waterB: WaterPreset }

  beforeEach(() => {
    initialState = {
      waterA: { ...waterPresets[1] },
      waterB: { ...waterPresets[5] }
    }
  })

  it('sets water preset', () => {
    const volvicPreset = waterPresets.find(p => p.id === 'volvic')
    const action = setPreset({ which: 'waterA', presetId: 'volvic' })
    const state = reducer(initialState, action)
    expect(state.waterA.id).toEqual('volvic')
    expect(state.waterA.hardness).toEqual(volvicPreset!.hardness)
    expect(state.waterA.alkalinity).toEqual(volvicPreset!.alkalinity)
  })

  it('sets water preset (backward compat check)', () => {
    const volvicPreset = waterPresets.find(p => p.id === 'volvic')
    const action = setPreset({ which: 'waterB', presetId: 'volvic' })
    const state = reducer(initialState, action)
    expect(state.waterB.id).toEqual('volvic')
    expect(state.waterB.hardness).toEqual(volvicPreset!.hardness)
  })
})

describe('updateIonValue', () => {
  let initialState: { waterA: WaterPreset; waterB: WaterPreset }

  beforeEach(() => {
    const bfs = waterPresets.find(p => p.id === 'black_forest_still')!
    initialState = {
      waterA: { ...bfs, ions: { ...bfs.ions } },
      waterB: waterPresets[2]
    }
  })

  it('updating ca recomputes hardness, leaves alkalinity unchanged', () => {
    const state = reducer(initialState, updateIonValue({ which: 'waterA', field: 'ca', value: 80 }))
    expect(state.waterA.hardness).toBeCloseTo(80 * 2.497 + 2.6 * 4.118, 0)
    expect(state.waterA.alkalinity).toBeCloseTo(30.5 * 0.8197, 0)
  })

  it('updating hco3 recomputes alkalinity, leaves hardness unchanged', () => {
    const volvic = waterPresets.find(p => p.id === 'volvic')!
    const state1 = reducer(
      { waterA: { ...volvic, ions: { ...volvic.ions } }, waterB: waterPresets[2] },
      updateIonValue({ which: 'waterA', field: 'hco3', value: 200 })
    )
    expect(state1.waterA.alkalinity).toBeCloseTo(200 * 0.8197, 0)
    expect(state1.waterA.hardness).toBeCloseTo(volvic.hardness, 0)
  })

  it('sets inputMode to ions and marks as custom', () => {
    const state = reducer(initialState, updateIonValue({ which: 'waterA', field: 'ca', value: 50 }))
    expect(state.waterA.inputMode).toBe('ions')
    expect(state.waterA.isCustom).toBe(true)
    expect(state.waterA.id).toBe('custom')
  })
})

describe('updateDirectValue', () => {
  let initialState: { waterA: WaterPreset; waterB: WaterPreset }

  beforeEach(() => {
    const volvic = waterPresets.find(p => p.id === 'volvic')!
    initialState = {
      waterA: { ...volvic, ions: { ...volvic.ions } },
      waterB: waterPresets[2]
    }
  })

  it('writes hardness directly without touching alkalinity', () => {
    const state = reducer(initialState, updateDirectValue({ which: 'waterA', field: 'hardness', value: 150 }))
    expect(state.waterA.hardness).toBe(150)
    const volvic = waterPresets.find(p => p.id === 'volvic')!
    expect(state.waterA.alkalinity).toBeCloseTo(volvic.alkalinity, 0)
  })

  it('sets inputMode to direct and marks as custom', () => {
    const state = reducer(initialState, updateDirectValue({ which: 'waterA', field: 'alkalinity', value: 99 }))
    expect(state.waterA.inputMode).toBe('direct')
    expect(state.waterA.isCustom).toBe(true)
    expect(state.waterA.id).toBe('custom')
  })
})