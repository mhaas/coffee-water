import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ZoneSelector from './ZoneSelector'

describe('ZoneSelector', () => {
  it('renders checkboxes for each zone', () => {
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

    render(<ZoneSelector zoneSelection={zoneSelection} onChange={() => {}} />)

    expect(screen.getByLabelText('SCAE Core')).not.toBeChecked()
    expect(screen.getByLabelText('SCAA')).toBeChecked()
  })

  it('renders empty zoneSelection correctly', () => {
    const { container } = render(<ZoneSelector zoneSelection={{}} onChange={() => {}} />)
    expect(container.querySelector('input')).toBeNull()
  })
})