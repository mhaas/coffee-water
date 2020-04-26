// @flow

import React from 'react'

import { VictoryChart, VictoryLine } from 'victory'

import type { PolygonType, PointType } from '../data/types'

type NamedPolygonType = PolygonType & {
  name: string
}

export type IndexedPointType = PointType & {
  index: number;
}

type Props = {
  polygons: Array<NamedPolygonType>
}

const convertPolygonToIndexed = (polygon: PolygonType): Array<IndexedPointType> => {
  const indexed = []
  polygon.points.forEach((point, index) => indexed.push({ x: point.x, y: point.y, index: index }))
  return indexed
}

const renderPolygon = (polygon: PolygonType): VictoryLine => {
  const indexed = convertPolygonToIndexed(polygon)
  return <VictoryLine data={indexed} sortKey='index' />
}

export default class Plot extends React.Component<Props> {
  render () {
    // VictoryChart will clone the children, it seems:
    // https://github.com/FormidableLabs/victory/blob/79e3dc0819d2398c069fd6077a161ee797ecfc45/packages/victory-chart/src/victory-chart.js#L84
    // VictoryChart will also interrogate its children to learn
    // about the domain, i.e. the min/max of their data. That's an
    // interesting choice, but the reason is clear.
    // The question is: what other things - besides automatically
    // determining domain - will break by using non-VictoryChart children?
    const children = []
    this.props.polygons.forEach((polygon) => children.push(renderPolygon(polygon)))

    return (
      <VictoryChart domain={[0, 500]}>
        {children}

      </VictoryChart>
    )
  }
}
