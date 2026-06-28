import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import has from 'lodash.has'

import { zoneMap, ScaeCore, ColonnaDHendon } from '../../data/zone'
import type { IdToZoneMap } from '../../data/types'

export interface SliceStateType {
  zones: IdToZoneMap
  selected: IdToZoneMap
}

const initialState: SliceStateType = {
  zones: zoneMap,
  selected: {
    [ScaeCore.id]: ScaeCore,
    [ColonnaDHendon.id]: ColonnaDHendon
  }
}

const zoneSelectionSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {
    select: (state, action: PayloadAction<string>) => {
      if (!has(state.zones, action.payload)) {
        throw Error(`Zone "${action.payload}" not found.`)
      }
      state.selected[action.payload] = state.zones[action.payload]
    },
    unselect: (state, action: PayloadAction<string>) => {
      if (!has(state.selected, action.payload)) {
        throw Error(`Zone "${action.payload}" is not selected.`)
      }
      delete state.selected[action.payload]
    }
  }
})

const { actions, reducer, name } = zoneSelectionSlice
const { select, unselect } = actions

export default reducer
export { select, unselect, name as sliceName }