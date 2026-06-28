import { useSelector } from 'react-redux'
import { Card, CardContent, Typography, List, ListItem, ListItemText, Divider, Box } from '@mui/material'

import { findRatiosForZone } from '../calculate/zone'
import type { StateType } from '../store/store'
import type { ZoneType } from '../data/types'
import type { WaterPreset } from '../data/waterPresets'

interface Props {
  selectedZones: ZoneType[]
  waterA: WaterPreset
  waterB: WaterPreset
}

interface MixResult {
  id: string
  name: string
  achievable: boolean
  minPct?: number
  maxPct?: number
  recipeMin?: string
  recipeMax?: string
}

const partsText = (pct: number): string => {
  if (pct === 0) return '100% Water B'
  if (pct === 100) return '100% Water A'
  const ratioVal = pct / (100 - pct)
  if (ratioVal >= 1) {
    return `${ratioVal.toFixed(1)} parts Water A to 1 part Water B`
  } else {
    return `1 part Water A to ${(1 / ratioVal).toFixed(1)} parts Water B`
  }
}

const renderSecondaryText = (res: MixResult) => {
  if (res.achievable) {
    return (
      <span style={{ color: '#2e7d32', display: 'block', marginTop: '4px' }}>
        ✓ Achievable! Blend between <strong>{res.minPct}%</strong> and <strong>{res.maxPct}%</strong> of Water A.
        <br />
        <span style={{ fontSize: '0.85rem', color: '#555', display: 'block', marginTop: '2px' }}>
          • Soft target recipe: {res.recipeMin}
          <br />
          • Hard target recipe: {res.recipeMax}
        </span>
      </span>
    )
  }

  return (
    <span style={{ color: '#d32f2f', display: 'block', marginTop: '4px' }}>
      ✗ Not Achievable. The line between your source waters does not intersect this zone. Try selecting softer or harder base waters!
    </span>
  )
}

function MixingCalculator({ selectedZones, waterA, waterB }: Props) {
  if (!waterA || !waterB) return null

  const results: MixResult[] = []

  selectedZones.forEach(zone => {
    const coordPoly: [number, number][] = zone.points.map(p => [p.x, p.y])

    const ratios = findRatiosForZone(
      waterA.alkalinity,
      waterA.hardness,
      waterB.alkalinity,
      waterB.hardness,
      coordPoly
    )

    if (ratios && ratios.length > 0) {
      const minRatio = Math.min(...ratios)
      const maxRatio = Math.max(...ratios)

      const minPct = Math.round(minRatio * 100)
      const maxPct = Math.round(maxRatio * 100)

      results.push({
        id: zone.id,
        name: zone.name,
        achievable: true,
        minPct,
        maxPct,
        recipeMin: partsText(minPct),
        recipeMax: partsText(maxPct)
      })
    } else {
      results.push({
        id: zone.id,
        name: zone.name,
        achievable: false
      })
    }
  })

  return (
    <Card style={{ marginTop: '16px' }} variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom style={{ display: 'flex', alignItems: 'center' }}>
          ☕ Water Recipe Mixing Calculator
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Given the coordinates of <strong>Water A</strong> (blue) and <strong>Water B</strong> (orange),
          the dotted mixing line represents all possible blend variations. Below are the recipes to land inside your selected target zones:
        </Typography>
        <Divider style={{ margin: '12px 0' }} />

        {results.length === 0 ? (
          <Box display="flex" alignItems="center" py={1}>
            <Typography variant="body2" style={{ fontStyle: 'italic' }}>
              Select one or more recommendation zones above to calculate recipes!
            </Typography>
          </Box>
        ) : (
          <List>
            {results.map(res => (
              <ListItem key={res.id} disableGutters>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" style={{ fontWeight: 600 }}>
                      {res.name}
                    </Typography>
                  }
                  secondary={renderSecondaryText(res)}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}

export default function StatefulMixingCalculator() {
  const selectedZones = Object.values(useSelector((state: StateType) => state.zones.selected))
  const waterA = useSelector((state: StateType) => state.waterSelection.waterA)
  const waterB = useSelector((state: StateType) => state.waterSelection.waterB)

  return <MixingCalculator selectedZones={selectedZones} waterA={waterA} waterB={waterB} />
}