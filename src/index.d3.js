import * as d3 from 'd3'

import * as alkalinity from './convert/alkalinity.js'
import * as hardness from './convert/hardness.js'

const mannheimHardnessDh = 20.6
const mannheimHardnessCaCO3Ppm = hardness.hardnessGHToCaCO3(
  mannheimHardnessDh
)

const mannheimAlkalinityHCO3MgPerL = 334
const mannheimAlkalinityCaCO3Ppm = alkalinity.alkalinityHCO3ToCaCO3(
  mannheimAlkalinityHCO3MgPerL
)

const blackForestHardnessCaMgPerL = 6.7
const blackForestHardnessMgMgPerL = 2.6

const blackForestHardnessCaCO3Pppm = hardness.hardnessCaMgToCaCO3(
  blackForestHardnessCaMgPerL,
  blackForestHardnessMgMgPerL
)

const blackForestAlkalinityHCO3MgPerL = 30.5

const blackForestAlkalinityCaCO3Ppm = alkalinity.alkalinityHCO3ToCaCO3(
  blackForestAlkalinityHCO3MgPerL
)

const zone = require('./zone.js')

const zoneData = require('./data/zone.js')

console.log('SCAE Core Zone')
zone.findRatiosForZone(
  mannheimAlkalinityCaCO3Ppm,
  mannheimHardnessCaCO3Ppm,
  blackForestAlkalinityCaCO3Ppm,
  blackForestHardnessCaCO3Pppm,
  zoneData.ScaeCore
)

console.log('Colonna-Dashwood & Hendon')
zone.findRatiosForZone(
  mannheimAlkalinityCaCO3Ppm,
  mannheimHardnessCaCO3Ppm,
  blackForestAlkalinityCaCO3Ppm,
  blackForestHardnessCaCO3Pppm,
  zoneData.ColonnaDHendon
)

console.log('Rao (Approximate)')
zone.findRatiosForZone(
  mannheimAlkalinityCaCO3Ppm,
  mannheimHardnessCaCO3Ppm,
  blackForestAlkalinityCaCO3Ppm,
  blackForestHardnessCaCO3Pppm,
  zoneData.RaoApproximate
)

console.log('Leeb & Rogalla (Approximate)')
zone.findRatiosForZone(
  mannheimAlkalinityCaCO3Ppm,
  mannheimHardnessCaCO3Ppm,
  blackForestAlkalinityCaCO3Ppm,
  blackForestHardnessCaCO3Pppm,
  zoneData.LeebRogallaApproximate
)
console.log('SCAA (Approximate)')
zone.findRatiosForZone(
  mannheimAlkalinityCaCO3Ppm,
  mannheimHardnessCaCO3Ppm,
  blackForestAlkalinityCaCO3Ppm,
  blackForestHardnessCaCO3Pppm,
  zoneData.ScaaApproximate
)

// 3.5 dH KH
// 5 dH GH

console.log(`3.5°dH carbonate hardness is ${alkalinity.alkalinityGHToCaCO3(3.5)} ppm CaCO3`)

console.log(`5°dH total hardness is ${hardness.hardnessGHToCaCO3(5)} ppm CaCO3`)

window.addEventListener('DOMContentLoaded', (event) => {
  const svgWidth = 500
  const svgHeight = 500

  const svg = d3.select('div#plot')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .attr('border', '50px')

  const width = 300
  const height = 300

  // Pixel coordinates are x, y; starting from 0,0 in the top-left corner

  const xScale = d3.scaleLinear().domain([0, 100]).range([0, width])

  const yScale = d3.scaleLinear().domain([0, 200]).range([height, 0])

  const xAxis = d3.axisBottom().scale(xScale)
  const yAxis = d3.axisLeft().scale(yScale)

  const xAxisTranslate = height

  svg.append('g').attr('transform', `translate(50, ${xAxisTranslate})`).call(xAxis)

  svg.append('g').attr('transform', 'translate(50, 0)').call(yAxis)

  svg.selectAll('polygon')
    .data([zoneData.ScaeCore])
    .enter().append('polygon')
    .attr('points', (d) => {
      return d.map((d) => {
        return [xScale(d[0]), yScale(d[1])].join(',')
      }).join(' ')
    }).attr('transform', 'translate(50, 0')

  const points = []

  for (let proportion = 0; proportion <= 1; proportion += 0.05) {
    const alkalinity = zone.calculateConcentration(proportion, mannheimAlkalinityCaCO3Ppm, blackForestAlkalinityCaCO3Ppm)
    const hardness = zone.calculateConcentration(proportion, mannheimHardnessCaCO3Ppm, blackForestHardnessCaCO3Pppm)
    points.push([alkalinity, hardness])
  }

  const line = d3.line().x(d => xScale(d[0])).y(d => yScale(d[1]))

  // https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0

  svg.append('path')
    .data([points])
    .attr('d', line)
    .attr('class', 'line')
    .attr('stroke', 'blue')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
})
