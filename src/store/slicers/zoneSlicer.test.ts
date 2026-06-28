import { describe, it, expect, beforeEach } from 'vitest'
import reducer, { select, unselect } from './zoneSlicer'

describe('actions', () => {
  it('mark as selected', () => {
    const expectedAction = {
      type: 'zones/select',
      payload: 'a-zone'
    }
    expect(select('a-zone')).toEqual(expectedAction)
  })
  it('mark as unselected', () => {
    const expectedAction = {
      type: 'zones/unselect',
      payload: 'a-zone'
    }
    expect(unselect('a-zone')).toEqual(expectedAction)
  })
})

interface Zone { points: never[] }
interface TestState {
  zones: Record<string, Zone>
  selected: Record<string, Zone>
}

describe('store', () => {
  let initialState: TestState
  let zoneSelectedState: TestState

  beforeEach(() => {
    const zones: Record<string, Zone> = {
      'zone-1': { points: [] },
      'zone-2': { points: [] }
    }

    initialState = {
      zones,
      selected: {}
    }

    zoneSelectedState = {
      ...initialState,
      selected: {
        'zone-1': { points: [] }
      }
    }
  })

  it('initial state contains zones', () => {
    const state = reducer(undefined, { type: '' })
    expect(state.zones).toEqual(expect.any(Object))
    expect(state.selected).toEqual({ scae_core: expect.objectContaining({ id: 'scae_core' }) })
  })

  it('select adds zone', () => {
    const newState = reducer(initialState as never, select('zone-1'))
    expect(newState).toEqual(zoneSelectedState)
  })

  it('unselect removes zone', () => {
    const newState = reducer(zoneSelectedState as never, unselect('zone-1'))
    expect(newState).toEqual(initialState)
  })

  it('selecting unknown zone raises error', () => {
    const shouldRaise = () => reducer(initialState as never, select('zone-unknown'))
    expect(shouldRaise).toThrowError('Zone "zone-unknown" not found.')
  })
  it('unselecting unknown zone raises error', () => {
    const shouldRaise = () => reducer(initialState as never, unselect('zone-unknown'))
    expect(shouldRaise).toThrowError('Zone "zone-unknown" is not selected.')
  })
})