// @flow

import React from 'react'
import { FormGroup, FormControlLabel, Checkbox } from '@material-ui/core'

type Zone = {
  label: string,
  checked: bool
}

type PropType = {
  zoneSelection: {
    [string]: Zone
  }
}

export default class ZoneSelector extends React.Component<PropType> {
  render () {
    const checkBoxes = []

    for (const zoneId of Object.keys(this.props.zoneSelection)) {
      const zoneDetail = this.props.zoneSelection[zoneId]
      const elem = (
        <FormControlLabel
          primary
          control={<Checkbox name={zoneId} checked={zoneDetail.checked} />}
          label={zoneDetail.label}
          key={zoneId}
        />
      )
      checkBoxes.push(elem)
    }

    return (
      <FormGroup row>
        {checkBoxes}
      </FormGroup>
    )
  }
}
