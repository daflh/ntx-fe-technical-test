import maplibregl from 'maplibre-gl'
import type { School } from '@/entities/school'
import {
  DEFAULT_STAGE_COLOR,
  HIGHLIGHT_CIRCLE_LAYER_ID,
  HIGHLIGHT_COLOR,
  HIGHLIGHT_SOURCE_ID,
  SCHOOLS_CIRCLE_LAYER_ID,
  SCHOOLS_LABEL_LAYER_ID,
  SCHOOLS_SOURCE_ID,
  STAGE_COLORS,
} from '../lib/mapConstants'
import { EMPTY_FEATURE_COLLECTION, schoolsToFeatureCollection } from '../lib/geojson'

/**
 * Encapsulates the GeoJSON source/layer setup for schools, keeping
 * MapView.vue focused on Vue lifecycle wiring rather than MapLibre layer
 * plumbing. Every function here is a plain call parameterized by the map
 * instance - nothing here is reactive, matching the "map instance is not a
 * Vue ref" rule.
 */
export function useSchoolsLayer() {
  function addLayers(map: maplibregl.Map): void {
    map.addSource(SCHOOLS_SOURCE_ID, { type: 'geojson', data: EMPTY_FEATURE_COLLECTION })
    map.addSource(HIGHLIGHT_SOURCE_ID, { type: 'geojson', data: EMPTY_FEATURE_COLLECTION })

    const stageColorExpression: (string | string[])[] = ['match', ['get', 'stage']]
    Object.entries(STAGE_COLORS).forEach(([stage, color]) => {
      stageColorExpression.push(stage, color)
    })
    stageColorExpression.push(DEFAULT_STAGE_COLOR)

    map.addLayer({
      id: SCHOOLS_CIRCLE_LAYER_ID,
      type: 'circle',
      source: SCHOOLS_SOURCE_ID,
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 3, 12, 7],
        // Style expressions are awkward to type precisely when built
        // dynamically from a Record - cast at this one boundary.
        'circle-color': stageColorExpression as any,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#ffffff',
      },
    })

    map.addLayer({
      id: SCHOOLS_LABEL_LAYER_ID,
      type: 'symbol',
      source: SCHOOLS_SOURCE_ID,
      minzoom: 11,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 11,
        'text-offset': [0, 1.3],
        'text-anchor': 'top',
      },
      paint: {
        'text-color': '#1e293b',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1,
      },
    })

    // Highlight layer added last so it renders above the base circle layer.
    map.addLayer({
      id: HIGHLIGHT_CIRCLE_LAYER_ID,
      type: 'circle',
      source: HIGHLIGHT_SOURCE_ID,
      paint: {
        'circle-radius': 11,
        'circle-color': HIGHLIGHT_COLOR,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    })
  }

  function syncSchools(map: maplibregl.Map, schools: School[]): void {
    const source = map.getSource(SCHOOLS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined
    source?.setData(schoolsToFeatureCollection(schools))
  }

  function fitToSchools(map: maplibregl.Map, schools: School[]): void {
    if (schools.length === 0) return

    if (schools.length === 1) {
      map.jumpTo({ center: [schools[0].long, schools[0].lat], zoom: 12 })
      return
    }

    const first = schools[0]
    const bounds = schools.reduce(
      (acc, school) => acc.extend([school.long, school.lat]),
      new maplibregl.LngLatBounds([first.long, first.lat], [first.long, first.lat]),
    )
    map.fitBounds(bounds, { padding: 48, maxZoom: 14, duration: 600 })
  }

  function syncHighlight(map: maplibregl.Map, school: School | null): void {
    const source = map.getSource(HIGHLIGHT_SOURCE_ID) as maplibregl.GeoJSONSource | undefined
    source?.setData(school ? schoolsToFeatureCollection([school]) : EMPTY_FEATURE_COLLECTION)
  }

  return { addLayers, syncSchools, fitToSchools, syncHighlight }
}
