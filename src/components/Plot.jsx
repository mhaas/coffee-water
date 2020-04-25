
import React from 'react'

import { VictoryChart, VictoryBar } from 'victory'

export default class Plot extends React.Component {
  render () {
    return (
      <VictoryChart>
        <VictoryBar />
      </VictoryChart>
    )
  }
}
