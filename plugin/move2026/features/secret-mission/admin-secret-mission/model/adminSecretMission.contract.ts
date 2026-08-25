import { z } from 'zod'

export const evidenceFileSchema = z.object({
  id: z.string(),
  url: z.string(),
  createdAt: z.string(),
})

// ---- Overview (danh sách) ----
export const adminSecretMissionOverviewItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isAssigned: z.boolean(),
  teamId: z.string().nullable().optional(),
  teamName: z.string().nullable().optional(),
  hasImageEvidence: z.boolean(),
  hasVideoEvidence: z.boolean(),
  lastUpdatedAt: z.string().nullable().optional(),
})
export type AdminSecretMissionOverviewItem = z.infer<typeof adminSecretMissionOverviewItemSchema>

// ---- Detail ----
export const adminSecretMissionDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  isAssigned: z.boolean(),
  teamId: z.string().nullable().optional(),
  teamName: z.string().nullable().optional(),
  evidenceImageUrls: z.array(evidenceFileSchema).nullable().optional(),
  evidenceVideoUrls: z.array(evidenceFileSchema).nullable().optional(),
})
export type AdminSecretMissionDetail = z.infer<typeof adminSecretMissionDetailSchema>

// ---- Create ----
export const createSecretMissionRequestSchema = z.object({
  raceId: z.string().uuid(),
  teamId: z.string().uuid('Vui lòng chọn đội để gán nhiệm vụ.'),
  name: z.string().min(1, 'Tên nhiệm vụ không được để trống.'),
  description: z.string().optional().default(''),
})
export type CreateSecretMissionRequest = z.infer<typeof createSecretMissionRequestSchema>

export const createSecretMissionResponseSchema = z.object({
  missionId: z.string(),
})
export type CreateSecretMissionResponse = z.infer<typeof createSecretMissionResponseSchema>

// ---- Update ----
export const updateSecretMissionRequestSchema = z.object({
  teamId: z.string().uuid('Vui lòng chọn đội để gán nhiệm vụ.'),
  name: z.string().min(1, 'Tên nhiệm vụ không được để trống.'),
  description: z.string().optional().default(''),
})
export type UpdateSecretMissionRequest = z.infer<typeof updateSecretMissionRequestSchema>

export const updateSecretMissionResponseSchema = z.boolean()
export type UpdateSecretMissionResponse = z.infer<typeof updateSecretMissionResponseSchema>

// ---- Delete ----
export const deleteSecretMissionResponseSchema = z.boolean()
export type DeleteSecretMissionResponse = z.infer<typeof deleteSecretMissionResponseSchema>