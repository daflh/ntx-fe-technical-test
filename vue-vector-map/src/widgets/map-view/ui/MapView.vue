<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useSchools, useSchoolSelection } from '@/entities/school'
import { INDONESIA_CENTER, INDONESIA_ZOOM, MAP_STYLE_URL } from '@/shared/config/constants'
import LoadingIndicator from '@/shared/ui/LoadingIndicator.vue'
import ErrorBanner from '@/shared/ui/ErrorBanner.vue'
import { useSchoolsLayer } from '../model/useSchoolsLayer'
import { SCHOOLS_CIRCLE_LAYER_ID } from '../lib/mapConstants'

const mapContainer = ref<HTMLDivElement | null>(null)
// Plain (non-reactive) variable, not a ref: MapLibre's Map instance holds a
// WebGL context and internal emitters that must never be deep-proxied by
// Vue's reactivity system.
let map: maplibregl.Map | null = null
const isMapLoaded = shallowRef(false)

const { schools, loading, error, fetchSchools } = useSchools()
const { selectedSchoolId, flyRequestToken, selectSchool } = useSchoolSelection()
const { addLayers, syncSchools, fitToSchools, syncHighlight } = useSchoolsLayer()

let hasFitBoundsOnce = false

function findSchool(id: string | null) {
  if (!id) return null
  return schools.value.find((s) => s.id === id) ?? null
}

function handleFeatureClick(event: maplibregl.MapLayerMouseEvent): void {
  const feature = event.features?.[0]
  const id = feature?.properties?.id as string | undefined
  if (id) selectSchool(id)
}

onMounted(() => {
  if (!mapContainer.value) return

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: MAP_STYLE_URL,
    center: INDONESIA_CENTER,
    zoom: INDONESIA_ZOOM,
  })

  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  map.on('load', () => {
    if (!map) return
    addLayers(map)

    map.on('click', SCHOOLS_CIRCLE_LAYER_ID, handleFeatureClick)
    map.on('mouseenter', SCHOOLS_CIRCLE_LAYER_ID, () => {
      if (map) map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', SCHOOLS_CIRCLE_LAYER_ID, () => {
      if (map) map.getCanvas().style.cursor = ''
    })

    isMapLoaded.value = true
    // Fetch may have already resolved before the map finished loading -
    // sync immediately instead of waiting for the next `schools` change.
    syncSchools(map, schools.value)
  })

  fetchSchools()
})

onUnmounted(() => {
  map?.remove()
  map = null
})

// Push new data into the map whenever the fetched list changes, and
// auto-fit-bounds exactly once (the first time we have data) so the user's
// manual pan/zoom afterwards isn't fought.
watch(schools, (list) => {
  if (!map || !isMapLoaded.value) return
  syncSchools(map, list)
  if (!hasFitBoundsOnce && list.length > 0) {
    fitToSchools(map, list)
    hasFitBoundsOnce = true
  }
})

// Highlight follows selection regardless of source (click or search).
watch(selectedSchoolId, (id) => {
  if (!map || !isMapLoaded.value) return
  syncHighlight(map, findSchool(id))
})

// Only fly the camera when the selection explicitly requested it (search
// picks a result that may be off-screen; a marker click is already visible).
watch(flyRequestToken, () => {
  if (!map || !isMapLoaded.value) return
  const school = findSchool(selectedSchoolId.value)
  if (!school) return
  map.flyTo({ center: [school.long, school.lat], zoom: Math.max(map.getZoom(), 13), essential: true })
})

function retryFetch(): void {
  fetchSchools()
}
</script>

<template>
  <div class="map-view">
    <div ref="mapContainer" class="map-view__canvas" />

    <div v-if="loading" class="map-view__status map-view__status--loading">
      <LoadingIndicator label="Loading schools..." />
    </div>

    <div v-else-if="error" class="map-view__status map-view__status--error">
      <ErrorBanner :message="error" retryable @retry="retryFetch" />
    </div>
  </div>
</template>

<style scoped>
.map-view {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-view__canvas {
  width: 100%;
  height: 100%;
}

.map-view__status {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 10;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
  padding: 0.5rem 0.75rem;
}

.map-view__status--error {
  padding: 0;
  box-shadow: none;
  background: transparent;
}
</style>
