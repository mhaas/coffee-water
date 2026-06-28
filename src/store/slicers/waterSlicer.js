// @flow

import { createSlice } from '@reduxjs/toolkit'
import { waterPresets, getPresetById } from '../../data/waterPresets'
import { ionsToProfile } from '../../calculate/ions'
import type { WaterPreset } from '../../data/waterPresets'

export type WaterSelectionState = {
  waterA: WaterPreset,
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
    setPreset: (state: WaterSelectionState, action) => {
      const { which, presetId } = action.payload
      const preset = getPresetById(presetId)
      if (preset) {
        state[which] = { ...preset, ions: { ...preset.ions } }
      }
      return state
    },

    // Update a single ion field (ca, mg, hco3) and recompute hardness/alkalinity.
    // Also accepts alkUnit updates (no recompute needed — just updates display preference).
    updateIonValue: (state: WaterSelectionState, action) => {
      const { which, field, value } = action.payload
      if (state[which] && state[which].ions) {
        if (field === 'alkUnit') {
          state[which].ions.alkUnit = value
        } else {
          state[which].ions[field] = Number(value) || 0
          const derived = ionsToProfile(state[which].ions)
          state[which].hardness = derived.hardness
          state[which].alkalinity = derived.alkalinity
        }
        state[which].inputMode = 'ions'
        state[which].isCustom = true
        state[which].id = 'custom'
        state[which].name = 'Custom...'
      }
      return state
    },

    // Write hardness or alkalinity directly in mg/L CaCO3.
    // Does not recompute ions — ions remain as last set by preset/updateIonValue.
    updateDirectValue: (state: WaterSelectionState, action) => {
      const { which, field, value } = action.payload
      if (state[which]) {
        state[which][field] = Number(value) || 0
        state[which].inputMode = 'direct'
        state[which].isCustom = true
        state[which].id = 'custom'
        state[which].name = 'Custom...'
      }
      return state
    },

    // @deprecated reducer removed — use updateIonValue or updateDirectValue
  }
})

export const { setPreset, updateIonValue, updateDirectValue } = waterSelectionSlice.actions
export const sliceName = 'waterSelection'
export default waterSelectionSlice.reducer
