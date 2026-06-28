import { configureStore } from '@reduxjs/toolkit'

import zoneReducer, { sliceName as zoneSliceName } from './slicers/zoneSlicer'
import type { SliceStateType as ZoneSliceStateType } from './slicers/zoneSlicer'

import waterReducer, { sliceName as waterSliceName } from './slicers/waterSlicer'
import type { WaterSelectionState } from './slicers/waterSlicer'

export interface StateType {
  zones: ZoneSliceStateType
  waterSelection: WaterSelectionState
}

const store = configureStore({
  reducer: {
    [zoneSliceName]: zoneReducer,
    [waterSliceName]: waterReducer
  }
})

export type AppDispatch = typeof store.dispatch

export default store