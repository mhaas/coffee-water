// @flow

/* global SyntheticEvent, HTMLInputElement, SyntheticInputEvent */

import React from 'react'
import {
  Card, CardContent, Typography, TextField, FormHelperText,
  Grid, MenuItem, Button, Divider, Box
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { waterPresets } from '../data/waterPresets'
import { normaliseAlkalinity, hardnessToCaCO3, CA_TO_CACO3 } from '../calculate/ions'
import type { WaterPreset } from '../data/waterPresets'
import type { AlkalinityUnit, HardnessUnit } from '../calculate/ions'

type PropsType = {
  label: string,
  water: WaterPreset,
  onChangePreset: (presetId: string) => void,
  onChangeIon: (field: string, value: number | string) => void,
  onChangeDirect: (field: string, value: number) => void,
}

type StateType = {
  // Which unit is currently displayed in the alkalinity input (custom only)
  alkUnit: AlkalinityUnit,
  // Raw value shown in the alkalinity input (may be in non-mg/L units)
  alkDisplayValue: string,
  // Which unit is displayed in the optional Gesamthärte convenience row
  hardnessUnit: HardnessUnit,
  // Whether the Gesamthärte convenience row is expanded
  showAltHardness: boolean,
  // Raw value shown in the Gesamthärte input
  hardnessDisplayValue: string,
}

const ALK_UNIT_LABELS = {
  mgL_hco3: 'HCO₃ (mg/L)',
  KH: 'Karbonathärte (°KH)',
  mmolL_ks43: 'Säurekapazität (mmol/L)'
}

const HARDNESS_UNIT_LABELS = {
  dH: 'Gesamthärte (°dH)',
  fH: 'Gesamthärte (°fH)',
  clark: 'Gesamthärte (°e / Clark)'
}

// Convert stored hco3 mg/L back to display value in the given unit
const hco3ToDisplayValue = (hco3MgL: number, unit: AlkalinityUnit): number => {
  switch (unit) {
    case 'mgL_hco3': return hco3MgL
    // mg/L HCO3 → mg/L CaCO3 → °KH
    case 'KH': return Math.round((hco3MgL * 0.8197) / 17.848 * 100) / 100
    // mg/L HCO3 → mmol/L
    case 'mmolL_ks43': return Math.round((hco3MgL / 61.02) * 100) / 100
    default: return hco3MgL
  }
}

class WaterSelector extends React.Component<PropsType, StateType> {
  constructor (props: PropsType) {
    super(props)
    const alkUnit = (props.water.ions && props.water.ions.alkUnit) || 'mgL_hco3'
    this.state = {
      alkUnit,
      alkDisplayValue: String(hco3ToDisplayValue(props.water.ions ? props.water.ions.hco3 : 0, alkUnit)),
      hardnessUnit: 'dH',
      showAltHardness: false,
      hardnessDisplayValue: ''
    }
  }

  componentDidUpdate (prevProps: PropsType) {
    // When preset changes externally, sync alkUnit and display value
    if (prevProps.water.id !== this.props.water.id) {
      const alkUnit = (this.props.water.ions && this.props.water.ions.alkUnit) || 'mgL_hco3'
      const hco3 = this.props.water.ions ? this.props.water.ions.hco3 : 0
      this.setState({
        alkUnit,
        alkDisplayValue: String(hco3ToDisplayValue(hco3, alkUnit))
      })
    }
  }

  handlePresetChange = (event: SyntheticEvent<HTMLInputElement>, value: ?WaterPreset) => {
    if (value) {
      this.props.onChangePreset(value.id)
    }
  }

  handleIonChange = (field: string) => (event: SyntheticInputEvent<HTMLInputElement>) => {
    const val = parseFloat(event.target.value)
    this.props.onChangeIon(field, isNaN(val) ? 0 : val)
  }

  handleAlkDisplayChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const raw = event.target.value
    this.setState({ alkDisplayValue: raw })
    const val = parseFloat(raw)
    if (!isNaN(val)) {
      // Normalise to mg/L HCO3 for storage
      const hco3 = normaliseAlkalinity(val, this.state.alkUnit)
      this.props.onChangeIon('hco3', hco3)
    }
  }

  handleAlkUnitChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const newUnit: AlkalinityUnit = (event.target.value: any)
    // Convert current hco3 mg/L to display value in new unit
    const hco3 = this.props.water.ions ? this.props.water.ions.hco3 : 0
    const newDisplay = String(hco3ToDisplayValue(hco3, newUnit))
    this.setState({ alkUnit: newUnit, alkDisplayValue: newDisplay })
    // Also store new unit preference in Redux
    this.props.onChangeIon('alkUnit', newUnit)
  }

  handleHardnessUnitChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ hardnessUnit: (event.target.value: any) })
  }

  handleAltHardnessChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const raw = event.target.value
    this.setState({ hardnessDisplayValue: raw })
    const val = parseFloat(raw)
    if (!isNaN(val)) {
      // Back-calculate: Gesamthärte → mg/L CaCO3 → Ca mg/L (Mg set to 0)
      const caco3 = hardnessToCaCO3(val, this.state.hardnessUnit)
      const caMgL = caco3 / CA_TO_CACO3
      this.props.onChangeIon('ca', caMgL)
      this.props.onChangeIon('mg', 0)
    }
  }

  handleDirectChange = (field: string) => (event: SyntheticInputEvent<HTMLInputElement>) => {
    const val = parseFloat(event.target.value)
    this.props.onChangeDirect(field, isNaN(val) ? 0 : val)
  }

  handleSwitchToDirect = () => {
    // Flip mode — keep current derived values as starting point
    this.props.onChangeDirect('hardness', this.props.water.hardness)
  }

  handleSwitchToIons = () => {
    // Flip mode — no-op ion update to switch inputMode back
    const ions = this.props.water.ions
    this.props.onChangeIon('ca', ions ? ions.ca : 0)
  }

  renderIonsMode () {
    const { water } = this.props
    const { alkUnit, alkDisplayValue, hardnessUnit, showAltHardness, hardnessDisplayValue } = this.state
    const isCustom = !!water.isCustom
    const ions = water.ions || { ca: 0, mg: 0, hco3: 0 }

    return (
      <>
        <Grid container spacing={2} alignItems='flex-start' style={{ marginTop: '8px' }}>

          {/* Ca */}
          <Grid item xs={12} sm={4}>
            <TextField
              label='Calcium (Ca)'
              type='number'
              variant='outlined'
              value={ions.ca}
              disabled={!isCustom}
              onChange={this.handleIonChange('ca')}
              inputProps={{ min: 0, step: 'any' }}
              fullWidth
            />
            <FormHelperText>mg/L</FormHelperText>
          </Grid>

          {/* Mg */}
          <Grid item xs={12} sm={4}>
            <TextField
              label='Magnesium (Mg)'
              type='number'
              variant='outlined'
              value={ions.mg}
              disabled={!isCustom}
              onChange={this.handleIonChange('mg')}
              inputProps={{ min: 0, step: 'any' }}
              fullWidth
            />
            <FormHelperText>mg/L</FormHelperText>
          </Grid>

          {/* Alkalinity — value + unit selector */}
          <Grid item xs={12} sm={4}>
            <TextField
              label='Bicarbonate / Alkalinity'
              type='number'
              variant='outlined'
              value={alkDisplayValue}
              disabled={!isCustom}
              onChange={this.handleAlkDisplayChange}
              inputProps={{ min: 0, step: 'any' }}
              fullWidth
            />
            <TextField
              select
              value={alkUnit}
              onChange={this.handleAlkUnitChange}
              disabled={!isCustom}
              variant='outlined'
              size='small'
              fullWidth
              style={{ marginTop: '4px' }}
            >
              {Object.entries(ALK_UNIT_LABELS).map(([val, label]) => (
                <MenuItem key={val} value={val}>{label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Derived ppm display — always read-only */}
          <Grid item xs={6}>
            <TextField
              label='Total Hardness'
              variant='filled'
              disabled
              value={Math.round(water.hardness)}
              fullWidth
            />
            <FormHelperText>ppm CaCO₃ (derived)</FormHelperText>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label='Alkalinity'
              variant='filled'
              disabled
              value={Math.round(water.alkalinity)}
              fullWidth
            />
            <FormHelperText>ppm CaCO₃ (derived)</FormHelperText>
          </Grid>

          {/* Gesamthärte convenience row — custom only */}
          {isCustom && (
            <Grid item xs={12}>
              <Button
                size='small'
                color='default'
                onClick={() => this.setState(s => ({ showAltHardness: !s.showAltHardness }))}
                style={{ textTransform: 'none', fontSize: '0.78rem', color: '#666' }}
              >
                {showAltHardness ? '▲ Hide Gesamthärte entry' : '▼ Or: enter Gesamthärte directly'}
              </Button>
            </Grid>
          )}

          {isCustom && showAltHardness && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Gesamthärte'
                  type='number'
                  variant='outlined'
                  value={hardnessDisplayValue}
                  onChange={this.handleAltHardnessChange}
                  inputProps={{ min: 0, step: 'any' }}
                  fullWidth
                />
                <FormHelperText>Sets Ca to equivalent value; Mg is set to 0</FormHelperText>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  value={hardnessUnit}
                  onChange={this.handleHardnessUnitChange}
                  variant='outlined'
                  size='small'
                  fullWidth
                  style={{ marginTop: '4px' }}
                >
                  {Object.entries(HARDNESS_UNIT_LABELS).map(([val, label]) => (
                    <MenuItem key={val} value={val}>{label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </>
          )}

          {/* Switch to direct entry — custom only */}
          {isCustom && (
            <Grid item xs={12}>
              <Button
                size='small'
                onClick={this.handleSwitchToDirect}
                style={{ textTransform: 'none', fontSize: '0.78rem' }}
              >
                Enter ppm directly →
              </Button>
            </Grid>
          )}
        </Grid>
      </>
    )
  }

  renderDirectMode () {
    const { water } = this.props
    return (
      <Grid container spacing={2} alignItems='flex-start' style={{ marginTop: '8px' }}>
        <Grid item xs={12} sm={5}>
          <TextField
            label='Total Hardness'
            type='number'
            variant='outlined'
            value={water.hardness}
            onChange={this.handleDirectChange('hardness')}
            inputProps={{ min: 0, step: 'any' }}
            fullWidth
          />
          <FormHelperText>ppm CaCO₃</FormHelperText>
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            label='Alkalinity'
            type='number'
            variant='outlined'
            value={water.alkalinity}
            onChange={this.handleDirectChange('alkalinity')}
            inputProps={{ min: 0, step: 'any' }}
            fullWidth
          />
          <FormHelperText>ppm CaCO₃</FormHelperText>
        </Grid>
        <Grid item xs={12}>
          <Button
            size='small'
            onClick={this.handleSwitchToIons}
            style={{ textTransform: 'none', fontSize: '0.78rem' }}
          >
            ← Enter ions instead
          </Button>
          <Typography variant='caption' display='block' color='textSecondary' style={{ marginTop: '4px' }}>
            Ion values reflect last preset — adjust Ca/Mg/HCO₃ fields as needed.
          </Typography>
        </Grid>
      </Grid>
    )
  }

  render () {
    const { label, water } = this.props
    const activePreset = waterPresets.find(p => p.id === water.id) || waterPresets[waterPresets.length - 1]

    return (
      <Card style={{ margin: '12px 0' }} variant='outlined'>
        <CardContent>
          <Typography variant='h6' color='textSecondary' gutterBottom>
            {label}
          </Typography>

          <Autocomplete
            options={waterPresets}
            getOptionLabel={(option) => option.name}
            value={activePreset}
            onChange={this.handlePresetChange}
            getOptionSelected={(option, value) => option.id === value.id}
            renderInput={(params) => <TextField {...params} label='Select Preset' variant='outlined' fullWidth />}
          />

          <Divider style={{ margin: '12px 0' }} />

          <Box>
            {water.inputMode === 'direct'
              ? this.renderDirectMode()
              : this.renderIonsMode()}
          </Box>
        </CardContent>
      </Card>
    )
  }
}

export default WaterSelector
