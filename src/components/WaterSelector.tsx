import { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Card, CardContent, Typography, TextField, FormHelperText,
  Grid, MenuItem, Button, Divider, Box, Autocomplete
} from '@mui/material'
import { waterPresets } from '../data/waterPresets'
import { normaliseAlkalinity, hardnessToCaCO3, CA_TO_CACO3 } from '../calculate/ions'
import { setPreset, updateIonValue, updateDirectValue } from '../store/slicers/waterSlicer'
import type { WaterPreset } from '../data/waterPresets'
import type { AlkalinityUnit, HardnessUnit } from '../calculate/ions'
import type { StateType, AppDispatch } from '../store/store'

interface Props {
  label: string
  water: WaterPreset
  onChangePreset: (presetId: string) => void
  onChangeIon: (field: string, value: number | string) => void
  onChangeDirect: (field: string, value: number) => void
}

const ALK_UNIT_LABELS: Record<string, string> = {
  mgL_hco3: 'HCO₃ (mg/L)',
  KH: 'Karbonathärte (°KH)',
  mmolL_ks43: 'Säurekapazität (mmol/L)'
}

const HARDNESS_UNIT_LABELS: Record<string, string> = {
  dH: 'Gesamthärte (°dH)',
  fH: 'Gesamthärte (°fH)',
  clark: 'Gesamthärte (°e / Clark)'
}

const hco3ToDisplayValue = (hco3MgL: number, unit: AlkalinityUnit): number => {
  switch (unit) {
    case 'mgL_hco3': return hco3MgL
    case 'KH': return Math.round((hco3MgL * 0.8197) / 17.848 * 100) / 100
    case 'mmolL_ks43': return Math.round((hco3MgL / 61.02) * 100) / 100
    default: return hco3MgL
  }
}

function WaterSelector({ label, water, onChangePreset, onChangeIon, onChangeDirect }: Props) {
  const alkUnitFromPreset = (water.ions?.alkUnit || 'mgL_hco3') as AlkalinityUnit
  const [alkUnit, setAlkUnit] = useState<AlkalinityUnit>(alkUnitFromPreset)
  const [alkDisplayValue, setAlkDisplayValue] = useState(
    String(hco3ToDisplayValue(water.ions ? water.ions.hco3 : 0, alkUnitFromPreset))
  )
  const [hardnessUnit, setHardnessUnit] = useState<HardnessUnit>('dH')
  const [showAltHardness, setShowAltHardness] = useState(false)
  const [hardnessDisplayValue, setHardnessDisplayValue] = useState('')

  useEffect(() => {
    const unit = (water.ions?.alkUnit || 'mgL_hco3') as AlkalinityUnit
    const hco3 = water.ions ? water.ions.hco3 : 0
    setAlkUnit(unit)
    setAlkDisplayValue(String(hco3ToDisplayValue(hco3, unit)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [water.id])

  const handlePresetChange = (_event: React.SyntheticEvent, value: WaterPreset | null) => {
    if (value) {
      onChangePreset(value.id)
    }
  }

  const handleIonChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(event.target.value)
    onChangeIon(field, isNaN(val) ? 0 : val)
  }

  const handleAlkDisplayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    setAlkDisplayValue(raw)
    const val = parseFloat(raw)
    if (!isNaN(val)) {
      const hco3 = normaliseAlkalinity(val, alkUnit)
      onChangeIon('hco3', hco3)
    }
  }

  const handleAlkUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUnit = event.target.value as AlkalinityUnit
    const hco3 = water.ions ? water.ions.hco3 : 0
    const newDisplay = String(hco3ToDisplayValue(hco3, newUnit))
    setAlkUnit(newUnit)
    setAlkDisplayValue(newDisplay)
    onChangeIon('alkUnit', newUnit)
  }

  const handleHardnessUnitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHardnessUnit(event.target.value as HardnessUnit)
  }

  const handleAltHardnessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value
    setHardnessDisplayValue(raw)
    const val = parseFloat(raw)
    if (!isNaN(val)) {
      const caco3 = hardnessToCaCO3(val, hardnessUnit)
      const caMgL = caco3 / CA_TO_CACO3
      onChangeIon('ca', caMgL)
      onChangeIon('mg', 0)
    }
  }

  const handleDirectChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(event.target.value)
    onChangeDirect(field, isNaN(val) ? 0 : val)
  }

  const handleSwitchToDirect = () => {
    onChangeDirect('hardness', water.hardness)
  }

  const handleSwitchToIons = () => {
    const ions = water.ions
    onChangeIon('ca', ions ? ions.ca : 0)
  }

  const isCustom = !!water.isCustom
  const ions = water.ions || { ca: 0, mg: 0, hco3: 0 }
  const activePreset = waterPresets.find(p => p.id === water.id) || waterPresets[waterPresets.length - 1]

  const renderIonsMode = () => (
    <>
      <Grid container spacing={2} alignItems="flex-start" style={{ marginTop: '8px' }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Calcium (Ca)"
            type="number"
            variant="outlined"
            value={ions.ca}
            disabled={!isCustom}
            onChange={handleIonChange('ca')}
            slotProps={{ htmlInput: { min: 0, step: 'any' } }}
            fullWidth
          />
          <FormHelperText>mg/L</FormHelperText>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Magnesium (Mg)"
            type="number"
            variant="outlined"
            value={ions.mg}
            disabled={!isCustom}
            onChange={handleIonChange('mg')}
            slotProps={{ htmlInput: { min: 0, step: 'any' } }}
            fullWidth
          />
          <FormHelperText>mg/L</FormHelperText>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Bicarbonate / Alkalinity"
            type="number"
            variant="outlined"
            value={alkDisplayValue}
            disabled={!isCustom}
            onChange={handleAlkDisplayChange}
            slotProps={{ htmlInput: { min: 0, step: 'any' } }}
            fullWidth
          />
          <TextField
            select
            value={alkUnit}
            onChange={handleAlkUnitChange}
            disabled={!isCustom}
            variant="outlined"
            size="small"
            fullWidth
            style={{ marginTop: '4px' }}
          >
            {Object.entries(ALK_UNIT_LABELS).map(([val, label]) => (
              <MenuItem key={val} value={val}>{label}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid size={6}>
          <TextField
            label="Total Hardness"
            variant="filled"
            disabled
            value={Math.round(water.hardness)}
            fullWidth
          />
          <FormHelperText>ppm CaCO₃ (derived)</FormHelperText>
        </Grid>
        <Grid size={6}>
          <TextField
            label="Alkalinity"
            variant="filled"
            disabled
            value={Math.round(water.alkalinity)}
            fullWidth
          />
          <FormHelperText>ppm CaCO₃ (derived)</FormHelperText>
        </Grid>

        {isCustom && (
          <Grid size={12}>
            <Button
              size="small"
              color="inherit"
              onClick={() => setShowAltHardness((s: boolean) => !s)}
              style={{ textTransform: 'none', fontSize: '0.78rem', color: '#666' }}
            >
              {showAltHardness ? '▲ Hide Gesamthärte entry' : '▼ Or: enter Gesamthärte directly'}
            </Button>
          </Grid>
        )}

        {isCustom && showAltHardness && (
          <>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Gesamthärte"
                type="number"
                variant="outlined"
                value={hardnessDisplayValue}
                onChange={handleAltHardnessChange}
                slotProps={{ htmlInput: { min: 0, step: 'any' } }}
                fullWidth
              />
              <FormHelperText>Sets Ca to equivalent value; Mg is set to 0</FormHelperText>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                value={hardnessUnit}
                onChange={handleHardnessUnitChange}
                variant="outlined"
                size="small"
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

        {isCustom && (
          <Grid size={12}>
            <Button
              size="small"
              onClick={handleSwitchToDirect}
              style={{ textTransform: 'none', fontSize: '0.78rem' }}
            >
              Enter ppm directly →
            </Button>
          </Grid>
        )}
      </Grid>
    </>
  )

  const renderDirectMode = () => (
    <Grid container spacing={2} alignItems="flex-start" style={{ marginTop: '8px' }}>
      <Grid size={{ xs: 12, sm: 5 }}>
        <TextField
          label="Total Hardness"
          type="number"
          variant="outlined"
          value={water.hardness}
          onChange={handleDirectChange('hardness')}
          slotProps={{ htmlInput: { min: 0, step: 'any' } }}
          fullWidth
        />
        <FormHelperText>ppm CaCO₃</FormHelperText>
      </Grid>
      <Grid size={{ xs: 12, sm: 5 }}>
        <TextField
          label="Alkalinity"
          type="number"
          variant="outlined"
          value={water.alkalinity}
          onChange={handleDirectChange('alkalinity')}
          slotProps={{ htmlInput: { min: 0, step: 'any' } }}
          fullWidth
        />
        <FormHelperText>ppm CaCO₃</FormHelperText>
      </Grid>
      <Grid size={12}>
        <Button
          size="small"
          onClick={handleSwitchToIons}
          style={{ textTransform: 'none', fontSize: '0.78rem' }}
        >
          ← Enter ions instead
        </Button>
        <Typography variant="caption" display="block" color="textSecondary" style={{ marginTop: '4px' }}>
          Ion values reflect last preset — adjust Ca/Mg/HCO₃ fields as needed.
        </Typography>
      </Grid>
    </Grid>
  )

  return (
    <Card style={{ margin: '12px 0' }} variant="outlined">
      <CardContent>
        <Typography variant="h6" color="textSecondary" gutterBottom>
          {label}
        </Typography>

        <Autocomplete
          options={waterPresets}
          getOptionLabel={(option) => option.name}
          value={activePreset}
          onChange={handlePresetChange}
          renderInput={(params) => <TextField {...params} label="Select Preset" variant="outlined" fullWidth />}
        />

        <Divider style={{ margin: '12px 0' }} />

        <Box>
          {water.inputMode === 'direct'
            ? renderDirectMode()
            : renderIonsMode()}
        </Box>
      </CardContent>
    </Card>
  )
}

interface StatefulWaterSelectorProps {
  which: 'waterA' | 'waterB'
  label: string
}

export default function StatefulWaterSelector({ which, label }: StatefulWaterSelectorProps) {
  const dispatch = useDispatch<AppDispatch>()
  const water = useSelector((state: StateType) => state.waterSelection[which])

  const onChangePreset = useCallback((presetId: string) => {
    dispatch(setPreset({ which, presetId }))
  }, [dispatch, which])

  const onChangeIon = useCallback((field: string, value: number | string) => {
    dispatch(updateIonValue({ which, field, value }))
  }, [dispatch, which])

  const onChangeDirect = useCallback((field: string, value: number) => {
    dispatch(updateDirectValue({ which, field: field as 'hardness' | 'alkalinity', value }))
  }, [dispatch, which])

  return (
    <WaterSelector
      label={label}
      water={water}
      onChangePreset={onChangePreset}
      onChangeIon={onChangeIon}
      onChangeDirect={onChangeDirect}
    />
  )
}