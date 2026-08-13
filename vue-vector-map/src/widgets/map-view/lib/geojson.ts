import type { School } from '@/entities/school'

// Minimal local GeoJSON typings (avoids depending on the `geojson` package
// resolving through pnpm's strict node_modules layout - we only need Point
// features for this widget).
export interface SchoolPointFeature {
  type: 'Feature'
  id: string
  geometry: { type: 'Point'; coordinates: [number, number] }
  properties: {
    id: string
    name: string
    npsn: string
    stage: string
    status: string
  }
}

export interface SchoolFeatureCollection {
  type: 'FeatureCollection'
  features: SchoolPointFeature[]
}

export const EMPTY_FEATURE_COLLECTION: SchoolFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
}

function schoolToFeature(school: School): SchoolPointFeature {
  return {
    type: 'Feature',
    id: school.id,
    geometry: { type: 'Point', coordinates: [school.long, school.lat] },
    properties: {
      id: school.id,
      name: school.name,
      npsn: school.npsn,
      stage: school.stage,
      status: school.status,
    },
  }
}

export function schoolsToFeatureCollection(schools: School[]): SchoolFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: schools.map(schoolToFeature),
  }
}
