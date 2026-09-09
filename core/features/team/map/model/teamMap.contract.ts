import { z } from 'zod'

/**
 * Runtime schema validating an individual station/booth from GET /Race/{raceId}.
 */
export const teamMapBoothSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    boothId: z.union([z.string(), z.number()]).optional(),
    name: z.string().nullable().optional().transform((val) => val?.trim() ?? '').default(''),
    boothName: z.string().nullable().optional(),
    place: z.string().nullable().optional().transform((val) => val?.trim() ?? '').default(''),
    boothLocation: z.string().nullable().optional(),
    description: z.string().nullable().optional().transform((val) => val?.trim() ?? '').default(''),
    isHidden: z
      .union([z.boolean(), z.string(), z.number()])
      .nullable()
      .optional()
      .transform((val) => {
        if (typeof val === 'string') return val.trim().toLowerCase() === 'true' || val.trim() === '1'
        if (typeof val === 'number') return val === 1
        return Boolean(val)
      })
      .default(false),
    status: z.string().nullable().optional().transform((val) => val ?? 'free').default('free'),
    mapX: z
      .union([z.number(), z.string()])
      .nullable()
      .optional()
      .transform((val) => {
        if (val == null || val === '') return null
        const num = Number(val)
        return Number.isFinite(num) ? num : null
      }),
    mapY: z
      .union([z.number(), z.string()])
      .nullable()
      .optional()
      .transform((val) => {
        if (val == null || val === '') return null
        const num = Number(val)
        return Number.isFinite(num) ? num : null
      }),
  })
  .passthrough()
  .transform((data) => ({
    ...data,
    id: String(data.id ?? data.boothId ?? ''),
    name: data.name || (data.boothName?.trim() ?? ''),
    place: data.place || (data.boothLocation?.trim() ?? ''),
  }))

export type TeamMapBoothResponse = z.infer<typeof teamMapBoothSchema>

const booleanFlagSchema = z.preprocess((val) => {
  if (val == null) return undefined
  if (typeof val === 'string') return val.trim().toLowerCase() === 'true' || val.trim() === '1'
  if (typeof val === 'number') return val === 1
  return Boolean(val)
}, z.boolean().optional())

/**
 * Runtime schema validating race map details and booths returned by GET /Race/{raceId}.
 */
export const teamMapDetailResponseSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  raceName: z.string().optional(),
  mapImageUrl: z.string().nullable().optional().transform((val) => val?.trim() || null),
  status: z.string().optional(),
  isShowHiddenBooths: booleanFlagSchema,
  isHideBoothDescription: booleanFlagSchema,
  isDisabledBoothStatus: booleanFlagSchema,
  booth: z.array(teamMapBoothSchema).nullish().transform((val) => val ?? []).default([]),
  booths: z.array(teamMapBoothSchema).nullish(),
}).passthrough().transform((data) => ({
  ...data,
  mapImageUrl: data.mapImageUrl?.trim() || null,
  booth: data.booth && data.booth.length > 0 ? data.booth : (data.booths ?? []),
}))

export type TeamMapDetailResponse = z.infer<typeof teamMapDetailResponseSchema>
