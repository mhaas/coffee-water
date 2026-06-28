import { FormGroup, FormControlLabel, Checkbox, Link, Typography } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import has from 'lodash.has'

import { select, unselect } from '../store/slicers/zoneSlicer'
import type { SourceInfo } from '../data/types'
import type { StateType } from '../store/store'

interface ZoneSelection {
  [zoneId: string]: {
    label: string
    checked: boolean
    source?: SourceInfo
  }
}

interface Props {
  zoneSelection: ZoneSelection
  onChange: (zoneId: string, checked: boolean) => void
}

const linkStyle: React.CSSProperties = { marginLeft: 4, fontSize: '0.75rem', verticalAlign: 'middle' }

function SourceLinks({ source }: { source: SourceInfo }) {
  return (
    <>
      <Link href={source.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        [source]
      </Link>
      {source.cacheUrl && (
        <Link href={source.cacheUrl} target="_blank" rel="noopener noreferrer" style={linkStyle}>
          [cache]
        </Link>
      )}
    </>
  )
}

export default function ZoneSelector({ zoneSelection, onChange }: Props) {
  const items = Object.keys(zoneSelection).map(zoneId => {
    const zoneDetail = zoneSelection[zoneId]
    return (
      <div key={zoneId}>
        <FormControlLabel
          control={
            <Checkbox
              name={zoneId}
              checked={zoneDetail.checked}
              onChange={(event) => onChange(zoneId, event.currentTarget.checked)}
            />
          }
          label={
            <span>
              {zoneDetail.label}
              {zoneDetail.source && <SourceLinks source={zoneDetail.source} />}
            </span>
          }
        />
        {zoneDetail.source?.citation && (
          <Typography variant="caption" style={{ display: 'block', marginLeft: 32, color: '#888', marginTop: -4, marginBottom: 8 }}>
            {zoneDetail.source.citation}
          </Typography>
        )}
      </div>
    )
  })

  return (
    <FormGroup>
      {items}
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
      checked: has(zoneSelectionState.selected, zoneId),
      source: zoneSelectionState.zones[zoneId].source
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