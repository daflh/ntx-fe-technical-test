import { computed, ref } from 'vue'
import { refDebounced } from '@vueuse/core'
import { useSchools, useSchoolSelection } from '@/entities/school'

const MAX_RESULTS = 8

export function useSchoolSearch() {
  const { schools } = useSchools()
  const { selectSchool } = useSchoolSelection()

  const query = ref('')
  const debouncedQuery = refDebounced(query, 300)

  const results = computed(() => {
    const q = debouncedQuery.value.trim().toLowerCase()
    if (!q) return []
    return schools.value
      .filter((school) => school.name.toLowerCase().includes(q) || school.npsn.includes(q))
      .slice(0, MAX_RESULTS)
  })

  const hasQuery = computed(() => debouncedQuery.value.trim().length > 0)

  function pickResult(schoolId: string): void {
    selectSchool(schoolId, { fly: true })
    query.value = ''
  }

  return { query, results, hasQuery, pickResult }
}
