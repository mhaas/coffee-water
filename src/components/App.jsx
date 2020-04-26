import React from 'react'

import Plot from './Plot'

import { hot } from 'react-hot-loader/root'

import * as zones from '../data/zone'

class App extends React.Component {
  render () {
    return <Plot polygons={[zones.ScaeCore, zones.RaoApproximate, zones.LeebRogallaApproximate]} />
  }
}
export default hot(App)
