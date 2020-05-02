// @flow
import React from 'react'

import { hot } from 'react-hot-loader/root'
import StatefulZoneSelector from './StatefulZoneSelector'

class App extends React.Component<{}> {
  render() {
    return <StatefulZoneSelector />
  }
}
export default hot(App)
