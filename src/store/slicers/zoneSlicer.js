// @flow

import { createSlice } from '@reduxjs/toolkit'
import has from 'lodash.has'

import { zoneMap } from '../../data/zone'
import type { IdToZoneMap } from '../../data/types'

// The reducers below directly mutate state. This is allowed
// because createSlice wraps the reducers inside the immer
// library.

export type SliceStateType = {
  zones: IdToZoneMap,
  selected: IdToZoneMap,
}

const initialState: SliceStateType = {
  zones: zoneMap,
  selected: {}
}

// Documentation for createSlice:
// https://redux-toolkit.js.org/api/createSlice
const zoneSelectionSlice = createSlice({
  name: 'zones',
  initialState: initialState,
  reducers: {
    // The following are 'case reducers'
    select: (state: SliceStateType, action) => {
      if (!has(state.zones, action.payload)) {
        throw Error(`Zone "${action.payload}" not found."`)
      }
      state.selected[action.payload] = state.zones[action.payload]
      return state
    },
    unselect: (state: SliceStateType, action) => {
      if (!has(state.selected, action.payload)) {
        throw Error(`Zone "${action.payload}" is not selected."`)
      }
      delete state.selected[action.payload]
      return state
    }
  }
})

const { actions, reducer, name } = zoneSelectionSlice
const { select, unselect } = actions

// This "reducer" is a slice reducer.
export default reducer
export { select, unselect, name as sliceName }
