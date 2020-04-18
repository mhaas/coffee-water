const inside = require('point-in-polygon')

const ratio = require('./ratio.js')

const findRatiosForZone = (alkalinityWater1, hardnessWater1, alkalinityWater2, hardnessWater2, zone) => {
  const minMaxAlkalinity = findMinMaxAlkalinityForZone(zone)
  const minAlkalinity = minMaxAlkalinity[0]
  const maxAlkalinity = minMaxAlkalinity[1]

  console.debug(`Zone: minimum alkalinity is ${minAlkalinity}, maximum alkalinity is ${maxAlkalinity}`)

  const stepAlkalinity = 0.5

  const ratios = []

  for (let targetAlkalinity = minAlkalinity; targetAlkalinity <= maxAlkalinity; targetAlkalinity += stepAlkalinity) {
    const proportionWater1 = ratio.calculateProportion(alkalinityWater1, alkalinityWater2, targetAlkalinity)

    if (proportionWater1 == null) {
      console.log(`No ratio can be found for target alkalinity ${targetAlkalinity}`)
      continue
    }

    const hardness = calculateConcentration(proportionWater1, hardnessWater1, hardnessWater2)

    if (inside([targetAlkalinity, hardness], zone)) {
      console.log(`(${proportionWater1}: ${targetAlkalinity} / ${hardness}) IN zone!`)
      ratios.push(proportionWater1)
    } else {
      // console.log(`(${proportionWater1}: ${targetAlkalinity} / ${hardness}) NOT in zone!`)
    }
  }
  return ratios
}

exports.findRatiosForZone = findRatiosForZone

const findMinMaxAlkalinityForZone = (zone) => {
  let min = null
  let max = null

  for (let idx = 0; idx < zone.length; idx++) {
    const point = zone[idx]
    const alk = point[0]
    if (min == null) {
      min = alk
      max = alk
    }
    if (min > alk) {
      min = alk
    }
    if (max < alk) {
      max = alk
    }
  }
  return [min, max]
}

const calculateConcentration = (proportionWater1, water1, water2) => {
  const proportionWater2 = (1 - proportionWater1)

  return (water1 * proportionWater1) + (water2 * proportionWater2)
}

exports.calculateConcentration = calculateConcentration
