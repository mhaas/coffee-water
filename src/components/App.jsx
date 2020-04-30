// @flow
import React from 'react'

// import Plot from './Plot'

import { hot } from 'react-hot-loader/root'

// import * as zones from '../data/zone'

import ZoneSelector from './ZoneSelector.jsx'

class App extends React.Component<{}> {
  render () {
    const zoneSelection = {
      'scae-core': {
        label: 'SCAE Core',
        checked: false
      },
      scaa: {
        label: 'SCAA',
        checked: true
      }
    }
    return <ZoneSelector zoneSelection={zoneSelection} />
    // return <Plot polygons={[zones.ScaeCore, zones.RaoApproximate, zones.LeebRogallaApproximate]} />
  }
}
export default hot(App)
