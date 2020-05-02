// @flow

export type PointType = {
    x: number;
    y: number;
}

export type PolygonType = {
    points: Array<PointType>
}

export type ZoneType = PolygonType & {
    id: string,
    name: string
}

export type IdToZoneMap = {
    [string]: ZoneType,
}
