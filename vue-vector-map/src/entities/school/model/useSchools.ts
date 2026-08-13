import { ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'
import { fetchRawSchools } from '../api/schoolApi'
import { mapSchools } from './school.mapper'
import type { School } from './school.types'

function _useSchools() {
  const schools = ref<School[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Guards against duplicate concurrent fetches when multiple components
  // (MapPage, search, detail panel) all call fetchSchools() on mount.
  let inFlight: Promise<void> | null = null

  async function fetchSchools(): Promise<void> {
    if (inFlight) return inFlight

    loading.value = true
    error.value = null

    inFlight = fetchRawSchools()
      .then((raw) => {
        const { schools: mapped, skippedCount } = mapSchools(raw)
        schools.value = mapped
        if (skippedCount > 0) {
          console.warn(`[useSchools] skipped ${skippedCount} invalid row(s) from the schools API.`)
        }
      })
      .catch(() => {
        error.value = 'Failed to load schools.'
      })
      .finally(() => {
        loading.value = false
        inFlight = null
      })

    return inFlight
  }

  return { schools, loading, error, fetchSchools }
}

export const useSchools = createSharedComposable(_useSchools)
