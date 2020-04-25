
// All data taken from the SCAE Water Chart Report by M. Wellinger
// et all.

// All mistakes my own!
const ScaeCore = [
  [39, 55],
  [39, 75],
  [60, 111],
  [63, 93],
  [57, 76],
  [49, 62],
  [39, 55]
]

const ColonnaDHendon = [
  // Very roughly taken from graphs in
  // SCAE Water chart
  [39, 55],
  [40, 160],
  [50, 170],
  [60, 174],
  [70, 173],
  [80, 172],
  [78, 140],
  [75, 120],
  [70, 100],
  [63, 80],
  [57, 76],
  [49, 62],
  [39, 55]
]

const RaoApproximate = [
  [45, 70],
  [45, 80],
  [55, 80],
  [55, 70],
  [45, 70]
]

const LeebRogallaApproximate = [
  [45, 140],
  [45, 150],
  [55, 150],
  [55, 140],
  [45, 140]

]

exports.ScaeCore = ScaeCore
exports.ColonnaDHendon = ColonnaDHendon
exports.RaoApproximate = RaoApproximate
exports.LeebRogallaApproximate = LeebRogallaApproximate

// Taken from http://www.scaa.org/?d=water-standards&page=resources
// Alkalinity is stated as "near 40mg/L" - this is implemented here
// as +/- 5 ppm CaCO3.
// Note that 1 mg/L CaCO3 == 1 ppm CaCO3
const ScaaApproximate = [
  [35, 17],
  [35, 85],
  [45, 85],
  [45, 17],
  [35, 17]
]

exports.ScaaApproximate = ScaaApproximate
