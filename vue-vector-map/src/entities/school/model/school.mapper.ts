import { rawSchoolSchema } from './school.schema'
import type { School } from './school.types'

export interface MapSchoolsResult {
  schools: School[]
  skippedCount: number
}

/**
 * Validates and maps raw API rows into the clean School domain type.
 * Each row is validated independently (safeParse, not one big
 * z.array(schema).parse()) so a single malformed row only drops that row -
 * it never discards the whole dataset.
 */
export function mapSchools(raw: unknown): MapSchoolsResult {
  const rows = Array.isArray(raw) ? raw : []
  const schools: School[] = []
  let skippedCount = 0

  rows.forEach((row, index) => {
    const result = rawSchoolSchema.safeParse(row)
    if (!result.success) {
      skippedCount += 1
      return
    }

    const r = result.data
    const id = r.npsn.trim().length > 0 ? r.npsn.trim() : `generated-${index}`

    schools.push({
      id,
      npsn: r.npsn,
      name: r.school_name,
      stage: r.stage,
      status: r.status,
      province: { id: r.province_id, name: r.province_name },
      city: { id: r.city_id, name: r.city_name },
      district: { id: r.district_id, name: r.district },
      street: r.street_name,
      lat: r.lat,
      long: r.long,
    })
  })

  return { schools, skippedCount }
}
