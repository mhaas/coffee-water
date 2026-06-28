import type { ZoneType, IdToZoneMap } from './types'

export const ScaeCore: ZoneType = {
  id: 'scae_core',
  name: 'SCAE Core Zone',
  color: '#1565c0',
  points: [
    { x: 39, y: 55 },
    { x: 39, y: 75 },
    { x: 60, y: 111 },
    { x: 63, y: 93 },
    { x: 57, y: 76 },
    { x: 49, y: 62 },
    { x: 39, y: 55 }
  ]
}

export const ColonnaDHendon: ZoneType = {
  id: 'colonna_hendon',
  name: 'Colonna-Dashwood & Hendon',
  color: '#6a1b9a',
  points: [
    { x: 39, y: 55 },
    { x: 40, y: 160 },
    { x: 50, y: 170 },
    { x: 60, y: 174 },
    { x: 70, y: 173 },
    { x: 80, y: 172 },
    { x: 78, y: 140 },
    { x: 75, y: 120 },
    { x: 70, y: 100 },
    { x: 63, y: 80 },
    { x: 57, y: 76 },
    { x: 49, y: 62 },
    { x: 39, y: 55 }
  ]
}

export const RaoApproximate: ZoneType = {
  id: 'rao_approx',
  name: 'Rao (approximate)',
  color: '#2e7d32',
  points: [
    { x: 45, y: 70 },
    { x: 45, y: 80 },
    { x: 55, y: 80 },
    { x: 55, y: 70 },
    { x: 45, y: 70 }
  ]
}

export const LeebRogallaApproximate: ZoneType = {
  id: 'leeb_rogalla_approx',
  name: 'Leeb & Rogalla (approximate)',
  color: '#e65100',
  points: [
    { x: 45, y: 140 },
    { x: 45, y: 150 },
    { x: 55, y: 150 },
    { x: 55, y: 140 },
    { x: 45, y: 140 }
  ]
}

export const ScaaApproximate: ZoneType = {
  id: 'scaa_approx',
  name: 'SCAA (approximate)',
  color: '#00838f',
  points: [
    { x: 35, y: 17 },
    { x: 35, y: 85 },
    { x: 45, y: 85 },
    { x: 45, y: 17 },
    { x: 35, y: 17 }
  ]
}

export const all = [ScaeCore, ColonnaDHendon, RaoApproximate,
  LeebRogallaApproximate, ScaaApproximate]

export const zoneMap: IdToZoneMap = {}
all.forEach((zone) => { zoneMap[zone.id] = zone })