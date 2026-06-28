import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'

import Plot from './Plot'
import { ScaeCore } from '../data/zone'
import { getPresetById } from '../data/waterPresets'

describe('Plot', () => {
  const polygons = Object.values({ [ScaeCore.id]: ScaeCore })
  const waterA = getPresetById('black_forest_still')!
  const waterB = getPresetById('volvic')!

  describe('zones mode', () => {
    it('renders without crashing', () => {
      expect(() => {
        render(<Plot polygons={polygons} mode="zones" waters={[]} />)
      }).not.toThrow()
    })
  })

  describe('evaluate mode', () => {
    it('renders without crashing with one water', () => {
      expect(() => {
        render(<Plot polygons={polygons} mode="evaluate" waters={[waterA]} />)
      }).not.toThrow()
    })

    it('renders without crashing with multiple waters', () => {
      expect(() => {
        render(<Plot polygons={polygons} mode="evaluate" waters={[waterA, waterB]} />)
      }).not.toThrow()
    })
  })

  describe('mix mode', () => {
    it('renders without crashing (regression test for MUI/Victory crash)', () => {
      expect(() => {
        render(<Plot polygons={polygons} mode="mix" waters={[waterA, waterB]} />)
      }).not.toThrow()
    })
  })
})
