// @flow

import { connect } from 'react-redux'
import has from 'lodash.has'

import ZoneSelector from './ZoneSelector'
import type { StateType } from '../store/store'

const mapStateToProps = (state: StateType) => {
  const zoneSelection = {}
  for (const zoneId of Object.keys(state.zones.zones)) {
    zoneSelection[zoneId] = {
      label: state.zones.zones[zoneId].name,
      checked: has(state.zones.selected, zoneId)
    }
  }
  return {
    zoneSelection: zoneSelection
  }
}

const StatefulZoneSelector = connect(mapStateToProps)(ZoneSelector)

export default StatefulZoneSelector
