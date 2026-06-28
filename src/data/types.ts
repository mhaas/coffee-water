export interface PointType {
  x: number
  y: number
}

export interface PolygonType {
  points: PointType[]
}

export interface SourceInfo {
  url: string
  citation?: string
  cacheUrl?: string
}

export interface ZoneType extends PolygonType {
  id: string
  name: string
  color: string
  source?: SourceInfo
}

export interface IdToZoneMap {
  [id: string]: ZoneType
}