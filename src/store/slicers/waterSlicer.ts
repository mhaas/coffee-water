import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { waterPresets, getPresetById } from '../../data/waterPresets'
import { ionsToProfile } from '../../calculate/ions'
import type { WaterPreset } from '../../data/waterPresets'

export interface WaterSelectionState {
  waterA: WaterPreset
  waterB: WaterPreset
}

const defaultWaterA = waterPresets.find(p => p.id === 'black_forest_still') || waterPresets[1]
const defaultWaterB = waterPresets.find(p => p.id === 'volvic') || waterPresets[2]

const initialState: WaterSelectionState = {
  waterA: { ...defaultWaterA, ions: { ...defaultWaterA.ions } },
  waterB: { ...defaultWaterB, ions: { ...defaultWaterB.ions } }
}

const waterSelectionSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    setPreset: (state, action: PayloadAction<{ which: 'waterA' | 'waterB'; presetId: string }>) => {
      const { which, presetId } = action.payload
      const preset = getPresetById(presetId)
      if (preset) {
        state[which] = { ...preset, ions: { ...preset.ions } }
      }
    },

    updateIonValue: (state, action: PayloadAction<{
      which: 'waterA' | 'waterB'
      field: string
      value: number | string
    }>) => {
      const { which, field, value } = action.payload
      if (state[which] && state[which].ions) {
        if (field === 'alkUnit') {
          state[which].ions.alkUnit = value as 'mgL_hco3' | 'KH' | 'mmolL_ks43'
        } else {
          (state[which].ions as unknown as Record<string, number>)[field] = Number(value) || 0
          const derived = ionsToProfile(state[which].ions)
          state[which].hardness = derived.hardness
          state[which].alkalinity = derived.alkalinity
        }
        state[which].inputMode = 'ions'
        state[which].isCustom = true
        state[which].id = 'custom'
        state[which].name = 'Custom...'
      }
    },

    updateDirectValue: (state, action: PayloadAction<{
      which: 'waterA' | 'waterB'
      field: 'hardness' | 'alkalinity'
      value: number
    }>) => {
      const { which, field, value } = action.payload
      if (state[which]) {
        state[which][field] = Number(value) || 0
        state[which].inputMode = 'direct'
        state[which].isCustom = true
        state[which].id = 'custom'
        state[which].name = 'Custom...'
      }
    },
  }
})

export const { setPreset, updateIonValue, updateDirectValue } = waterSelectionSlice.actions
export const sliceName = 'waterSelection'
export default waterSelectionSlice.reducer