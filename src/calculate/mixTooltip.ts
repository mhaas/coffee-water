import type { WaterPreset } from '../data/waterPresets'

export const computeMixRatio = (cursorX: number, waterA: WaterPreset, waterB: WaterPreset): number | null => {
  if (waterA.alkalinity == null || waterB.alkalinity == null) return null

  const ax = Number(waterA.alkalinity)
  const bx = Number(waterB.alkalinity)

  if (isNaN(ax) || isNaN(bx)) return null

  if (Math.abs(bx - ax) < 1) return 0

  const minX = Math.min(ax, bx)
  const maxX = Math.max(ax, bx)

  if (cursorX < minX || cursorX > maxX) return null

  const ratio = (cursorX - ax) / (bx - ax)
  return Math.max(0, Math.min(1, ratio))
}

export const computeMixRatioFromPoint = (
  cursorX: number,
  cursorY: number,
  waterA: WaterPreset,
  waterB: WaterPreset,
  threshold: number = 20
): number | null => {
  if (
    waterA.alkalinity == null || waterB.alkalinity == null ||
    waterA.hardness == null || waterB.hardness == null
  ) return null

  const ax = Number(waterA.alkalinity)
  const ay = Number(waterA.hardness)
  const bx = Number(waterB.alkalinity)
  const by = Number(waterB.hardness)

  if (isNaN(ax) || isNaN(ay) || isNaN(bx) || isNaN(by)) return null

  const dx = bx - ax
  const dy = by - ay
  const lenSq = dx * dx + dy * dy

  if (lenSq < 1) return 0

  const t = Math.max(0, Math.min(1, ((cursorX - ax) * dx + (cursorY - ay) * dy) / lenSq))

  const closestX = ax + t * dx
  const closestY = ay + t * dy

  const dist = Math.sqrt(Math.pow(cursorX - closestX, 2) + Math.pow(cursorY - closestY, 2))

  if (dist > threshold) return null

  return t
}

export const formatRatio = (ratio: number, nameA: string, nameB: string): string => {
  const pctA = Math.round((1 - ratio) * 100)
  const pctB = Math.round(ratio * 100)
  if (pctA === 100) return `100% ${nameA}`
  if (pctB === 100) return `100% ${nameB}`
  return `${pctA}% ${nameA} + ${pctB}% ${nameB}`
}