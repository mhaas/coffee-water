// @flow

import type { PolygonType } from './types'

// All data taken from the SCAE Water Chart Report by M. Wellinger
// et all.

// All mistakes my own!
const ScaeCore: PolygonType = {
  points: [
    { x: 39, y: 55 },
    { x: 39, y: 75 },
    { x: 60, y: 111 },
    { x: 63, y: 93 },
    { x: 57, y: 76 },
    { x: 49, y: 62 },
    { x: 39, y: 55 }
  ]
}

const ColonnaDHendon: PolygonType = {
  points: [
    // Very roughly taken from graphs in
    // SCAE Water chart
    { x: 39, y: 55 },
    { x: 40, y: 160 },
    { x: 50, y: 170 },
    { x: 60, y: 174 },
    { x: 70, y: 173 },
    { x: 80, y: 172 },
    { x: 78, y: 140 },
    { x: 75, y: 120 },
    { x: 70, y: 100 },
    { x: 63, y: 80 },
    { x: 57, y: 76 },
    { x: 49, y: 62 },
    { x: 39, y: 55 }
  ]
}

const RaoApproximate: PolygonType = {
  points: [
    { x: 45, y: 70 },
    { x: 45, y: 80 },
    { x: 55, y: 80 },
    { x: 55, y: 70 },
    { x: 45, y: 70 }
  ]
}

const LeebRogallaApproximate: PolygonType = {
  points: [
    { x: 45, y: 140 },
    { x: 45, y: 150 },
    { x: 55, y: 150 },
    { x: 55, y: 140 },
    { x: 45, y: 140 }
  ]
}

exports.ScaeCore = ScaeCore
exports.ColonnaDHendon = ColonnaDHendon
exports.RaoApproximate = RaoApproximate
exports.LeebRogallaApproximate = LeebRogallaApproximate

// Taken from http://www.scaa.org/?d=water-standards&page=resources
// Alkalinity is stated as "near 40mg/L" - this is implemented here
// as +/- 5 ppm CaCO3.
// Note that 1 mg/L CaCO3 == 1 ppm CaCO3
const ScaaApproximate: PolygonType = {
  points: [
    { x: 35, y: 17 },
    { x: 35, y: 85 },
    { x: 45, y: 85 },
    { x: 45, y: 17 },
    { x: 35, y: 17 }
  ]
}

exports.ScaaApproximate = ScaaApproximate
