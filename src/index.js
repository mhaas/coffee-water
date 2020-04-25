
import * as alkalinity from './convert/alkalinity.js'
import * as hardness from './convert/hardness.js'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'

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

window.addEventListener('DOMContentLoaded', (event) => {
  const domContainer = document.querySelector('#container')
  ReactDOM.render(<App />, domContainer)
})
