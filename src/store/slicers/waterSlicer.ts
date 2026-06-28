import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { waterPresets, getPresetById } from '../../data/waterPresets'
import { ionsToProfile } from '../../calculate/ions'
import type { WaterPreset } from '../../data/waterPresets'

export interface WaterSelectionState {
  waters: WaterPreset[]
}

const defaultWaterA = waterPresets.find(p => p.id === 'black_forest_still') || waterPresets[1]
const defaultWaterB = waterPresets.find(p => p.id === 'volvic') || waterPresets[2]

const initialState: WaterSelectionState = {
  waters: [
    { ...defaultWaterA, ions: { ...defaultWaterA.ions } },
    { ...defaultWaterB, ions: { ...defaultWaterB.ions } }
  ]
}

const waterSelectionSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    addWater: (state) => {
      const preset = waterPresets.find(p => p.id === 'black_forest_still') || waterPresets[1]
      state.waters.push({ ...preset, ions: { ...preset.ions } })
    },

    removeWater: (state, action: PayloadAction<number>) => {
      state.waters.splice(action.payload, 1)
    },

    setPreset: (state, action: PayloadAction<{ index: number; presetId: string }>) => {
      const { index, presetId } = action.payload
      const preset = getPresetById(presetId)
      if (preset && state.waters[index]) {
        state.waters[index] = { ...preset, ions: { ...preset.ions } }
      }
    },

    updateIonValue: (state, action: PayloadAction<{
      index: number
      field: string
      value: number | string
    }>) => {
      const { index, field, value } = action.payload
      const water = state.waters[index]
      if (water && water.ions) {
        if (field === 'alkUnit') {
          water.ions.alkUnit = value as 'mgL_hco3' | 'KH' | 'mmolL_ks43'
        } else {
          (water.ions as unknown as Record<string, number>)[field] = Number(value) || 0
          const derived = ionsToProfile(water.ions)
          water.hardness = derived.hardness
          water.alkalinity = derived.alkalinity
        }
        water.inputMode = 'ions'
        water.isCustom = true
        water.id = 'custom'
        water.name = 'Custom...'
      }
    },

    updateDirectValue: (state, action: PayloadAction<{
      index: number
      field: 'hardness' | 'alkalinity'
      value: number
    }>) => {
      const { index, field, value } = action.payload
      const water = state.waters[index]
      if (water) {
        water[field] = Number(value) || 0
        water.inputMode = 'direct'
        water.isCustom = true
        water.id = 'custom'
        water.name = 'Custom...'
      }
    },
  }
})

export const { setPreset, updateIonValue, updateDirectValue, addWater, removeWater } = waterSelectionSlice.actions
export const sliceName = 'waterSelection'
export default waterSelectionSlice.reducer