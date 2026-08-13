import { z } from 'zod'

// AniList's GraphQL schema is stable (unlike a flaky third-party REST
// endpoint), so one bulk safeParse on the whole response is enough here -
// no need for the per-row safeParse pattern used for the dummy schools API
// in the sibling BAB 03 project.
export const mediaTitleSchema = z.object({
  romaji: z.string().nullable().optional(),
  english: z.string().nullable().optional(),
})

export const rawAnimeMediaSchema = z.object({
  id: z.number(),
  title: mediaTitleSchema,
  coverImage: z
    .object({ large: z.string().nullable().optional() })
    .nullable()
    .optional(),
  seasonYear: z.number().nullable().optional(),
  episodes: z.number().nullable().optional(),
  averageScore: z.number().nullable().optional(),
  genres: z.array(z.string()).nullable().optional(),
  siteUrl: z.string().nullable().optional(),
})

export const pageInfoSchema = z.object({
  currentPage: z.number(),
  hasNextPage: z.boolean(),
  total: z.number(),
})

export const searchAnimeResponseSchema = z.object({
  Page: z.object({
    pageInfo: pageInfoSchema,
    media: z.array(rawAnimeMediaSchema),
  }),
})

export type RawAnimeMedia = z.infer<typeof rawAnimeMediaSchema>
export type RawSearchAnimeResponse = z.infer<typeof searchAnimeResponseSchema>
