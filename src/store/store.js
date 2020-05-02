// @flow

import { configureStore } from '@reduxjs/toolkit'

import zoneReducer, { sliceName as zoneSliceName } from './slicers/zoneSlicer'
import type { SliceStateType as ZoneSliceStatetype } from './slicers/zoneSlicer'

export type StateType = {
  // How can I use zoneSliceName here?
  zones: ZoneSliceStatetype,
}

const store = configureStore({
  reducer: {
    // A part of the state under the "zones" key is owned by
    // the zoneSlicer.
    [zoneSliceName]: zoneReducer
  }
})

export default store
