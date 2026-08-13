import { ref } from 'vue'
import { createSharedComposable } from '@vueuse/core'

interface SelectOptions {
  /** Whether the map should fly/pan to this school (e.g. from search). A
   * plain marker click doesn't need to fly since it's already on screen. */
  fly?: boolean
}

function _useSchoolSelection() {
  const selectedSchoolId = ref<string | null>(null)
  // Incremented on every fly-requesting selection so MapView can distinguish
  // "selection changed, fly there" from "selection changed via a click,
  // just update the highlight/detail panel in place".
  const flyRequestToken = ref(0)

  function selectSchool(id: string | null, options: SelectOptions = {}): void {
    selectedSchoolId.value = id
    if (options.fly && id) {
      flyRequestToken.value += 1
    }
  }

  function clearSelection(): void {
    selectedSchoolId.value = null
  }

  return { selectedSchoolId, flyRequestToken, selectSchool, clearSelection }
}

export const useSchoolSelection = createSharedComposable(_useSchoolSelection)
