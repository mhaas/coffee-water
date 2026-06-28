import { useState } from 'react'
import { createElement } from 'react'
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
  waterA: WaterPreset | null
  waterB: WaterPreset | null
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

interface CursorPoint {
  x: number
  y: number
}

export default function Plot({ polygons, mode, waterA, waterB }: Props) {
  const [cursor, setCursor] = useState<CursorPoint | null>(null)

  const showMixLine = mode === 'mix' && waterA != null && waterB != null

  let tooltip = null
  if (showMixLine && cursor != null && waterA && waterB) {
    const ratio = computeMixRatioFromPoint(cursor.x, cursor.y, waterA, waterB)
    if (ratio != null) {
      const label = formatRatio(ratio, waterA.name, waterB.name)
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

  const children = polygons.map(polygon => renderPolygon(polygon))

  const scatterData: { x: number; y: number; label: string; color: string }[] = []
  const legendData: { name: string; symbol: { fill: string } }[] = []

  if (mode === 'evaluate' || mode === 'mix') {
    if (waterA) {
      scatterData.push({ x: waterA.alkalinity, y: waterA.hardness, label: waterA.name, color: '#00bcd4' })
      legendData.push({ name: waterA.name, symbol: { fill: '#00bcd4' } })
    }
  }

  if (mode === 'mix') {
    if (waterB) {
      scatterData.push({ x: waterB.alkalinity, y: waterB.hardness, label: waterB.name, color: '#ff9800' })
      legendData.push({ name: waterB.name, symbol: { fill: '#ff9800' } })
    }
  }

  const connectionLine = showMixLine && waterA && waterB
    ? (
      <VictoryLine
        data={[
          { x: waterA.alkalinity, y: waterA.hardness },
          { x: waterB.alkalinity, y: waterB.hardness }
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
      {tooltip}
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
  )
}

import { useSelector } from 'react-redux'
import type { StateType } from '../store/store'

interface StatefulPlotProps {
  mode: 'zones' | 'evaluate' | 'mix'
}

export function StatefulPlot({ mode }: StatefulPlotProps) {
  const polygons = Object.values(useSelector((state: StateType) => state.zones.selected))
  const waterA = useSelector((state: StateType) => state.waterSelection.waterA)
  const waterB = useSelector((state: StateType) => state.waterSelection.waterB)

  return (
    <Plot
      polygons={polygons}
      mode={mode}
      waterA={waterA}
      waterB={waterB}
    />
  )
}