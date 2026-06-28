export interface PointType {
  x: number
  y: number
}

export interface PolygonType {
  points: PointType[]
}

export interface ZoneType extends PolygonType {
  id: string
  name: string
  color: string
}

export interface IdToZoneMap {
  [id: string]: ZoneType
}