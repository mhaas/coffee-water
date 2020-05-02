import React from 'react'
import ZoneSelector from './ZoneSelector'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const zoneSelection = {
    'scae-core': {
      label: 'SCAE Core',
      checked: false
    },
    scaa: {
      label: 'SCAA',
      checked: true
    }
  }

  const tree = renderer
    .create(<ZoneSelector zoneSelection={zoneSelection} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})

it('renders correctly empty zoneSelection correctly', () => {
  const zoneSelection = {}
  const tree = renderer
    .create(<ZoneSelector zoneSelection={zoneSelection} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
