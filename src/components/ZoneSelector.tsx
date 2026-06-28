import { FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import has from 'lodash.has'

import { select, unselect } from '../store/slicers/zoneSlicer'
import type { StateType } from '../store/store'

interface ZoneSelection {
  [zoneId: string]: {
    label: string
    checked: boolean
  }
}

interface Props {
  zoneSelection: ZoneSelection
  onChange: (zoneId: string, checked: boolean) => void
}

export default function ZoneSelector({ zoneSelection, onChange }: Props) {
  const checkBoxes = Object.keys(zoneSelection).map(zoneId => {
    const zoneDetail = zoneSelection[zoneId]
    return (
      <FormControlLabel
        key={zoneId}
        control={
          <Checkbox
            name={zoneId}
            checked={zoneDetail.checked}
            onChange={(event) => onChange(zoneId, event.currentTarget.checked)}
          />
        }
        label={zoneDetail.label}
      />
    )
  })

  return (
    <FormGroup row>
      {checkBoxes}
    </FormGroup>
  )
}

export function StatefulZoneSelector() {
  const dispatch = useDispatch()
  const zoneSelectionState = useSelector((state: StateType) => state.zones)

  const zoneSelection: ZoneSelection = {}
  for (const zoneId of Object.keys(zoneSelectionState.zones)) {
    zoneSelection[zoneId] = {
      label: zoneSelectionState.zones[zoneId].name,
      checked: has(zoneSelectionState.selected, zoneId)
    }
  }

  return (
    <ZoneSelector
      zoneSelection={zoneSelection}
      onChange={(zoneId, checked) =>
        checked ? dispatch(select(zoneId)) : dispatch(unselect(zoneId))
      }
    />
  )
}