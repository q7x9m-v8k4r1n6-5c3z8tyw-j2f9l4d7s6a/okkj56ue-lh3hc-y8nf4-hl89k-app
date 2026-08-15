import { z } from 'zod'

export const secretMissionOverviewItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  isAssigned: z.boolean(),
  hasImageEvidence: z.boolean(),
  hasVideoEvidence: z.boolean(),
  lastUpdatedAt: z.string().nullable().optional(),
})

export type SecretMissionOverviewDto = z.infer<typeof secretMissionOverviewItemSchema>

export type SecretMissionListItem = {
  id: string
  name: string
  isAssigned: boolean
  isCompleted: boolean
  lastUpdatedAt: string | null
}

export const mapOverviewDtoToFrontendModel = (
  dto: SecretMissionOverviewDto
): SecretMissionListItem => ({
  id: dto.id,
  name: dto.name,
  isAssigned: dto.isAssigned,
  isCompleted: dto.hasImageEvidence || dto.hasVideoEvidence,
  lastUpdatedAt: dto.lastUpdatedAt ?? null,
})