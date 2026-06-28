import { describe, it, expect, beforeEach } from 'vitest'
import reducer, { setPreset, updateIonValue, updateDirectValue, addWater, removeWater } from './waterSlicer'
import { waterPresets } from '../../data/waterPresets'
import type { WaterPreset } from '../../data/waterPresets'

describe('waterSlicer actions & reducer', () => {
  let initialState: { waters: WaterPreset[] }

  beforeEach(() => {
    initialState = {
      waters: [
        { ...waterPresets[1], ions: { ...waterPresets[1].ions } },
        { ...waterPresets[5], ions: { ...waterPresets[5].ions } }
      ]
    }
  })

  it('sets water preset', () => {
    const volvicPreset = waterPresets.find(p => p.id === 'volvic')
    const action = setPreset({ index: 0, presetId: 'volvic' })
    const state = reducer(initialState, action)
    expect(state.waters[0].id).toEqual('volvic')
    expect(state.waters[0].hardness).toEqual(volvicPreset!.hardness)
    expect(state.waters[0].alkalinity).toEqual(volvicPreset!.alkalinity)
  })

  it('sets water preset at index 1', () => {
    const volvicPreset = waterPresets.find(p => p.id === 'volvic')
    const action = setPreset({ index: 1, presetId: 'volvic' })
    const state = reducer(initialState, action)
    expect(state.waters[1].id).toEqual('volvic')
    expect(state.waters[1].hardness).toEqual(volvicPreset!.hardness)
  })

  it('addWater appends a default preset', () => {
    const state = reducer(initialState, addWater())
    expect(state.waters).toHaveLength(3)
    expect(state.waters[2].id).toBe('black_forest_still')
  })

  it('removeWater removes at given index', () => {
    const state = reducer(initialState, removeWater(0))
    expect(state.waters).toHaveLength(1)
    expect(state.waters[0].id).toBe(initialState.waters[1].id)
  })
})

describe('updateIonValue', () => {
  let initialState: { waters: WaterPreset[] }

  beforeEach(() => {
    const bfs = waterPresets.find(p => p.id === 'black_forest_still')!
    const volvic = waterPresets.find(p => p.id === 'volvic')!
    initialState = {
      waters: [
        { ...bfs, ions: { ...bfs.ions } },
        { ...volvic, ions: { ...volvic.ions } }
      ]
    }
  })

  it('updating ca recomputes hardness, leaves alkalinity unchanged', () => {
    const state = reducer(initialState, updateIonValue({ index: 0, field: 'ca', value: 80 }))
    expect(state.waters[0].hardness).toBeCloseTo(80 * 2.497 + 2.6 * 4.118, 0)
    expect(state.waters[0].alkalinity).toBeCloseTo(30.5 * 0.8197, 0)
  })

  it('updating hco3 recomputes alkalinity, leaves hardness unchanged', () => {
    const bfs = waterPresets.find(p => p.id === 'black_forest_still')!
    const state = reducer(initialState, updateIonValue({ index: 0, field: 'hco3', value: 200 }))
    expect(state.waters[0].alkalinity).toBeCloseTo(200 * 0.8197, 0)
    expect(state.waters[0].hardness).toBeCloseTo(bfs.hardness, 0)
  })

  it('sets inputMode to ions and marks as custom', () => {
    const state = reducer(initialState, updateIonValue({ index: 0, field: 'ca', value: 50 }))
    expect(state.waters[0].inputMode).toBe('ions')
    expect(state.waters[0].isCustom).toBe(true)
    expect(state.waters[0].id).toBe('custom')
  })
})

describe('updateDirectValue', () => {
  let initialState: { waters: WaterPreset[] }

  beforeEach(() => {
    const volvic = waterPresets.find(p => p.id === 'volvic')!
    initialState = {
      waters: [
        { ...volvic, ions: { ...volvic.ions } },
        { ...waterPresets[2], ions: { ...waterPresets[2].ions } }
      ]
    }
  })

  it('writes hardness directly without touching alkalinity', () => {
    const state = reducer(initialState, updateDirectValue({ index: 0, field: 'hardness', value: 150 }))
    expect(state.waters[0].hardness).toBe(150)
    const volvic = waterPresets.find(p => p.id === 'volvic')!
    expect(state.waters[0].alkalinity).toBeCloseTo(volvic.alkalinity, 0)
  })

  it('sets inputMode to direct and marks as custom', () => {
    const state = reducer(initialState, updateDirectValue({ index: 0, field: 'alkalinity', value: 99 }))
    expect(state.waters[0].inputMode).toBe('direct')
    expect(state.waters[0].isCustom).toBe(true)
    expect(state.waters[0].id).toBe('custom')
  })
})