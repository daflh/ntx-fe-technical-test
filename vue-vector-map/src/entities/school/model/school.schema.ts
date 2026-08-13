import { z } from 'zod'

// The dummy API is otherwise well-behaved, but we coerce numeric-looking
// fields defensively (some public APIs occasionally send numbers as
// strings) and reject coordinates that are missing/out of range/exactly
// (0,0) - a very common "null island" sentinel for bad geocoding.
export const rawSchoolSchema = z
  .object({
    province_id: z.coerce.number(),
    province_name: z.string(),
    city_id: z.coerce.number(),
    city_name: z.string(),
    district_id: z.coerce.number(),
    district: z.string(),
    npsn: z.string(),
    school_name: z.string(),
    stage: z.string(),
    status: z.string(),
    street_name: z.string(),
    lat: z.coerce.number(),
    long: z.coerce.number(),
  })
  .refine((row) => row.lat >= -90 && row.lat <= 90, { message: 'latitude out of range' })
  .refine((row) => row.long >= -180 && row.long <= 180, { message: 'longitude out of range' })
  .refine((row) => !(row.lat === 0 && row.long === 0), { message: 'null-island coordinates' })

export type RawSchool = z.infer<typeof rawSchoolSchema>
