import { useState } from 'react'
import {
  Container, Grid, Typography, Box, Paper, AppBar, Toolbar, Tabs, Tab
} from '@mui/material'

import { StatefulZoneSelector } from './ZoneSelector'
import { StatefulPlot } from './Plot'
import StatefulWaterSelector from './WaterSelector'
import StatefulMixingCalculator from './MixingCalculator'

type Mode = 'zones' | 'evaluate' | 'mix'

export default function App() {
  const [mode, setMode] = useState<Mode>('zones')

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
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper style={{ padding: '20px' }} variant="outlined">
                <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                  Your Water
                </Typography>
                <StatefulWaterSelector which="waterA" label="Select or enter your water" />
              </Paper>
            </Grid>
          )}

          {mode === 'mix' && (
            <>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper style={{ padding: '20px', height: '100%' }} variant="outlined">
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                    Water A
                  </Typography>
                  <StatefulWaterSelector which="waterA" label="Water A (e.g. Distilled / RO base)" />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <Paper style={{ padding: '20px', height: '100%' }} variant="outlined">
                  <Typography variant="h6" gutterBottom style={{ fontWeight: 600 }}>
                    Water B
                  </Typography>
                  <StatefulWaterSelector which="waterB" label="Water B (e.g. Mineral / Tap)" />
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <StatefulMixingCalculator />
              </Grid>
            </>
          )}

        </Grid>
      </Container>
    </Box>
  )
}