// @flow

import { connect } from 'react-redux'

import WaterSelector from './WaterSelector'
import { setPreset, updateIonValue, updateDirectValue } from '../store/slicers/waterSlicer'
import type { StateType } from '../store/store'

type OwnProps = {
  which: 'waterA' | 'waterB',
  label: string
}

const mapStateToProps = (state: StateType, ownProps: OwnProps) => {
  return {
    water: state.waterSelection[ownProps.which]
  }
}

const mapDispatchToProps = (dispatch, ownProps: OwnProps) => {
  return {
    onChangePreset: (presetId) => {
      dispatch(setPreset({ which: ownProps.which, presetId }))
    },
    onChangeIon: (field, value) => {
      dispatch(updateIonValue({ which: ownProps.which, field, value }))
    },
    onChangeDirect: (field, value) => {
      dispatch(updateDirectValue({ which: ownProps.which, field, value }))
    }
  }
}

// $FlowFixMe
const StatefulWaterSelector = connect(mapStateToProps, mapDispatchToProps)(WaterSelector)

export default StatefulWaterSelector
