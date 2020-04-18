
const alkalinity = require('./convert/alkalinity.js')
const hardness = require('./convert/hardness.js')

console.log(hardness.hardnessM)

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

