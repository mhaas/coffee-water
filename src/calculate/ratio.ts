export const calculateParts = (firstMeasure: number, secondMeasure: number, targetMeasure: number): number => {
  return (targetMeasure - secondMeasure) / (firstMeasure - targetMeasure)
}

export const calculateProportion = (firstMeasure: number, secondMeasure: number, targetMeasure: number): number | null => {
  if ((firstMeasure < targetMeasure && secondMeasure < targetMeasure) || (firstMeasure > targetMeasure && secondMeasure > targetMeasure)) {
    return null
  }

  const deltaToFirstMeasure = Math.abs(firstMeasure - targetMeasure)
  const deltaToSecondMeasure = Math.abs(targetMeasure - secondMeasure)

  return deltaToSecondMeasure / (deltaToSecondMeasure + deltaToFirstMeasure)
}