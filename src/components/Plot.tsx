import { useState } from 'react'
import { createElement } from 'react'
import { FormControlLabel, Checkbox } from '@mui/material'
import {
  VictoryChart, VictoryLine, VictoryScatter, VictoryAxis,
  VictoryLabel, VictoryLegend, VictoryCursorContainer
} from 'victory'

import type { ZoneType, PointType } from '../data/types'
import type { WaterPreset } from '../data/waterPresets'
import { computeMixRatioFromPoint, formatRatio } from '../calculate/mixTooltip'

interface IndexedPointType extends PointType {
  index: number
}

interface Props {
  polygons: ZoneType[]
  mode: 'zones' | 'evaluate' | 'mix'
  waters: WaterPreset[]
}

const CHART_WIDTH = 900
const CHART_HEIGHT = 560
const DOMAIN = 450

const convertPolygonToIndexed = (polygon: ZoneType): IndexedPointType[] => {
  return polygon.points.map((point, index) => ({ x: point.x, y: point.y, index }))
}

const renderPolygon = (polygon: ZoneType) => {
  const indexed = convertPolygonToIndexed(polygon)
  const c = polygon.color
  return (
    <VictoryLine
      data={indexed}
      sortKey="index"
      key={polygon.id}
      style={{
        data: { stroke: c, strokeWidth: 2, fill: c, fillOpacity: 0.12 }
      }}
    />
  )
}

const dataXToPixel = (x: number, padding: number = 50): number => {
  return padding + (x / DOMAIN) * (CHART_WIDTH - padding * 2)
}

const dataYToPixel = (y: number, padding: number = 50): number => {
  return padding + ((DOMAIN - y) / DOMAIN) * (CHART_HEIGHT - padding * 2)
}

interface CursorPoint {
  x: number
  y: number
}

const WATER_COLORS = ['#00bcd4', '#ff9800', '#4caf50', '#e91e63', '#9c27b0', '#3f51b5', '#ff5722']

export default function Plot({ polygons, mode, waters }: Props) {
  const [cursor, setCursor] = useState<CursorPoint | null>(null)
  const [showTasteLabels, setShowTasteLabels] = useState(true)

  const showMixLine = mode === 'mix' && waters.length >= 2

  let tooltip = null
  if (showMixLine && cursor != null && waters.length >= 2) {
    const wa = waters[0]
    const wb = waters[1]
    const ratio = computeMixRatioFromPoint(cursor.x, cursor.y, wa, wb)
    if (ratio != null) {
      const label = formatRatio(ratio, wa.name, wb.name)
      const pixelX = dataXToPixel(cursor.x)
      tooltip = (
        <div style={{
          position: 'absolute',
          left: pixelX + 16 + 'px',
          top: '24px',
          background: 'rgba(30,30,30,0.82)',
          color: '#fff',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          zIndex: 10
        }}>
          {label}
        </div>
      )
    }
  }

  const cornerLabels = [
    { x: 20, y: 220, label: 'Heavy,\nDull, Sour' },
    { x: 20, y: 20, label: 'Weak,\nSour, Sharp' },
    { x: 100, y: 20, label: 'Weak,\nChalky, Flat' },
    { x: 100, y: 220, label: 'Heavy,\nChalky, Flat' }
  ]

  const cornerBoxes = cornerLabels.map(({ x, y, label }) => {
    const left = dataXToPixel(x)
    const top = dataYToPixel(y)
    return (
      <div key={label} style={{
        position: 'absolute',
        left: left + 'px',
        top: top + 'px',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(255,255,255,0.85)',
        border: '1px solid #ccc',
        borderRadius: '6px',
        padding: '4px 8px',
        fontSize: '10px',
        lineHeight: '1.4',
        color: '#666',
        textAlign: 'center',
        whiteSpace: 'pre-line',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        {label}
      </div>
    )
  })

  const children = polygons.map(polygon => renderPolygon(polygon))

  const scatterData: { x: number; y: number; label: string; color: string }[] = []
  const legendData: { name: string; symbol: { fill: string } }[] = []

  if (mode === 'evaluate' || mode === 'mix') {
    waters.forEach((w, i) => {
      const color = WATER_COLORS[i % WATER_COLORS.length]
      scatterData.push({ x: w.alkalinity, y: w.hardness, label: w.name, color })
      legendData.push({ name: w.name, symbol: { fill: color } })
    })
  }

  const connectionLine = showMixLine && waters.length >= 2
    ? (
      <VictoryLine
        data={[
          { x: waters[0].alkalinity, y: waters[0].hardness },
          { x: waters[1].alkalinity, y: waters[1].hardness }
        ]}
        style={{
          data: { stroke: '#9e9e9e', strokeWidth: 1.5, strokeDasharray: '4, 4' }
        }}
      />
      )
    : null

  const containerComponent = showMixLine
    ? (
      <VictoryCursorContainer
        onCursorChange={(value) =>
          setCursor(value && typeof value === 'object' ? value : null)
        }
        cursorComponent={<line style={{ stroke: 'transparent' }} />}
      />
      )
    : undefined

  return (
    <div style={{ width: '100%', background: '#fafafa', borderRadius: '8px', padding: '16px', position: 'relative' }}>
      {showTasteLabels && cornerBoxes}
      {tooltip}
      <FormControlLabel
        control={<Checkbox checked={showTasteLabels} onChange={(_, c) => setShowTasteLabels(c)} size="small" />}
        label={<span style={{ fontSize: '11px', color: '#888' }}>Show taste labels</span>}
        style={{ margin: 0, position: 'absolute', left: '20px', bottom: '8px', zIndex: 3 }}
      />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <VictoryChart
        domain={{ x: [0, DOMAIN], y: [0, DOMAIN] }}
        height={CHART_HEIGHT}
        width={CHART_WIDTH}
        animate={{ duration: 300 }}
        containerComponent={containerComponent}
      >
        <VictoryAxis
          label="Alkalinity (ppm CaCO3)"
          axisLabelComponent={<VictoryLabel dy={15} style={{ fontSize: 12, fill: '#666' }} />}
          style={{
            axis: { stroke: '#757575' },
            ticks: { stroke: '#757575', size: 5 },
            tickLabels: { fontSize: 10, padding: 5, fill: '#666' }
          }}
        />

        <VictoryAxis
          dependentAxis
          label="Total Hardness (ppm CaCO3)"
          axisLabelComponent={<VictoryLabel dy={-15} style={{ fontSize: 12, fill: '#666' }} />}
          style={{
            axis: { stroke: '#757575' },
            ticks: { stroke: '#757575', size: 5 },
            tickLabels: { fontSize: 10, padding: 5, fill: '#666' }
          }}
        />

        {children}

        {connectionLine}

        {scatterData.length > 0 && (
          <VictoryScatter
            data={scatterData}
            size={6}
            style={{
              data: {
                fill: ({ datum }) => (datum as { color: string }).color,
                stroke: '#fff',
                strokeWidth: 2
              },
              labels: { fontSize: 9, fill: '#333', fontWeight: 'bold' }
            }}
            labels={({ datum }) => (datum as { label: string }).label}
            labelComponent={<VictoryLabel dy={-10} />}
          />
        )}

        <VictoryLegend
          x={780}
          y={10}
          orientation="vertical"
          gutter={10}
          titleComponent={createElement('g')}
          style={{ border: { stroke: 'none' }, labels: { fontSize: 10, fill: '#444' } }}
          data={[
            ...polygons.map(p => ({ name: p.name, symbol: { fill: p.color, type: 'square' as const } })),
            ...legendData
          ]}
        />
      </VictoryChart>
      </div>
    </div>
  )
}

import { useSelector } from 'react-redux'
import type { StateType } from '../store/store'

interface StatefulPlotProps {
  mode: 'zones' | 'evaluate' | 'mix'
}

export function StatefulPlot({ mode }: StatefulPlotProps) {
  const polygons = Object.values(useSelector((state: StateType) => state.zones.selected))
  const waters = useSelector((state: StateType) => state.waterSelection.waters)

  return (
    <Plot
      polygons={polygons}
      mode={mode}
      waters={waters}
    />
  )
}