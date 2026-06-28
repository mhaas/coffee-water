import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container, Grid, Typography, Box, Paper, AppBar, Toolbar, Tabs, Tab, Link, Divider, Button
} from '@mui/material'

import { StatefulZoneSelector } from './ZoneSelector'
import { StatefulPlot } from './Plot'
import StatefulWaterSelector from './WaterSelector'
import StatefulMixingCalculator from './MixingCalculator'
import { addWater, removeWater } from '../store/slicers/waterSlicer'
import type { StateType, AppDispatch } from '../store/store'

type Mode = 'zones' | 'evaluate' | 'mix'

export default function App() {
  const [mode, setMode] = useState<Mode>('zones')
  const dispatch = useDispatch<AppDispatch>()
  const numWaters = useSelector((state: StateType) => state.waterSelection.waters.length)

  return (
    <Box style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '32px' }}>
      <AppBar position="static" style={{ backgroundColor: '#4e342e', marginBottom: '0' }}>
        <Toolbar>
          <Typography variant="h6" style={{ fontWeight: 'bold', color: '#fff', flexGrow: 1 }}>
            ☕ Coffee Water Recipe Studio
          </Typography>
        </Toolbar>
        <Tabs
          value={mode}
          onChange={(_event, value: Mode) => setMode(value)}
          style={{ backgroundColor: '#3e2723' }}
          TabIndicatorProps={{ style: { backgroundColor: '#ffcc80' } }}
        >
          <Tab
            label="Zones"
            value="zones"
            style={{ color: mode === 'zones' ? '#ffcc80' : '#bcaaa4', fontWeight: mode === 'zones' ? 700 : 400 }}
          />
          <Tab
            label="Evaluate a Water"
            value="evaluate"
            style={{ color: mode === 'evaluate' ? '#ffcc80' : '#bcaaa4', fontWeight: mode === 'evaluate' ? 700 : 400 }}
          />
          <Tab
            label="Mix Two Waters"
            value="mix"
            style={{ color: mode === 'mix' ? '#ffcc80' : '#bcaaa4', fontWeight: mode === 'mix' ? 700 : 400 }}
          />
        </Tabs>
      </AppBar>

      <Container maxWidth="xl" style={{ marginTop: '24px' }}>
        <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 8 }}>
            <Paper style={{ padding: '20px', height: '100%' }} variant="outlined">
              <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                Water Profile Chart
              </Typography>
              <StatefulPlot mode={mode} />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper style={{ padding: '20px', height: '100%' }} variant="outlined">
              <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                Coffee Water Guidelines
              </Typography>
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: '12px' }}>
                Overlay specialty coffee water standard zones on the chart.
              </Typography>
              <StatefulZoneSelector />
            </Paper>
          </Grid>

          {mode === 'evaluate' && (
            <>
              {Array.from({ length: numWaters }, (_, i) => (
                <Grid size={{ xs: 12, md: 6 }} key={i}>
                  <Paper style={{ padding: '20px' }} variant="outlined">
                    <StatefulWaterSelector
                      index={i}
                      label={i === 0 ? 'Your Water' : `Water ${i + 1}`}
                      onRemove={numWaters > 1 ? () => dispatch(removeWater(i)) : undefined}
                    />
                  </Paper>
                </Grid>
              ))}
              <Grid size={{ xs: 12 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => dispatch(addWater())}
                  style={{ textTransform: 'none' }}
                >
                  + Add Water
                </Button>
              </Grid>
            </>
          )}

          {mode === 'mix' && (
            <>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper style={{ padding: '20px', height: '100%' }} variant="outlined">
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                    Water A
                  </Typography>
                  <StatefulWaterSelector index={0} label="Water A (e.g. Distilled / RO base)" />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper style={{ padding: '20px', height: '100%' }} variant="outlined">
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                    Water B
                  </Typography>
                  <StatefulWaterSelector index={1} label="Water B (e.g. Mineral / Tap)" />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <StatefulMixingCalculator />
              </Grid>
            </>
          )}

        </Grid>
      </Container>

      <Container maxWidth="xl" style={{ marginTop: '32px' }}>
        <Paper style={{ padding: '20px' }} variant="outlined">
          <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
            References
          </Typography>
          <Divider style={{ marginBottom: '12px' }} />
          <Typography variant="body2" style={{ marginBottom: 8 }}>
            Wellinger, M., Smrke, S. and Yeretzian, C., "Water for Extraction—Composition, Recommendations, and Treatment", in <em>The Craft and Science of Coffee</em> (ed. B. Folmer), Academic Press, 2017, pp. 381-398.{' '}
            <Link href="The-Craft-and-Science-of-Coffee2017-Chapter16Water.pdf" target="_blank" rel="noopener noreferrer">
              [cached copy]
            </Link>{' '}
            <Link href="https://doi.org/10.1016/B978-0-12-803520-7.00016-5" target="_blank" rel="noopener noreferrer">
              [DOI]
            </Link>
          </Typography>
          <Typography variant="body2" style={{ marginBottom: 8 }}>
            Wellinger, M., Smrke, S. and Yeretzian, C., <em>The SCAE Water Chart</em>, Specialty Coffee Association of Europe, 2016.{' '}
            <Link href="SCAE-water-chart-report.pdf" target="_blank" rel="noopener noreferrer">
              [cached copy]
            </Link>
          </Typography>
          <Typography variant="body2">
            <em>SCAA Standard — Water for Brewing Specialty Coffee</em>, Specialty Coffee Association of America, 2009.{' '}
            <Link href="ST - WATER STANDARD V.21NOV2009A.pdf" target="_blank" rel="noopener noreferrer">
              [cached copy]
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}