
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

describe('store', () => {
  let initialState = null
  let zoneSelectedState = null

  beforeEach(() => {
    const zones = {
      'zone-1': {
        points: []
      },
      'zone-2': {
        points: []
      }
    }

    initialState = {
      zones: zones,
      selected: {}
    }

    zoneSelectedState = {
      ...initialState,
      selected: {
        'zone-1': {
          points: []
        }
      }
    }
  })

  it('initial state is the empty dict', () => {
    const initialState = reducer(undefined, {})
    expect(initialState).toEqual({})
  })

  it('select adds zone', () => {
    const newState = reducer(initialState, select('zone-1'))
    expect(newState).toEqual(zoneSelectedState)
  })

  it('unselect removes zone', () => {
    const newState = reducer(zoneSelectedState, unselect('zone-1'))
    expect(newState).toEqual(initialState)
  })

  it('selecting unknown zone raises error', () => {
    const shouldRaise = () => reducer(initialState, select('zone-unknown'))
    expect(shouldRaise).toThrowError('Zone "zone-unknown" not found.')
  })
  it('unselecting unknown zone raises error', () => {
    const shouldRaise = () => reducer(initialState, unselect('zone-unknown'))
    expect(shouldRaise).toThrowError('Zone "zone-unknown" is not selected.')
  })
})
