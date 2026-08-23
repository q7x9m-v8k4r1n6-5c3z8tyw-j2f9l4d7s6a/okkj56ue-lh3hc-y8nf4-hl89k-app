import { client } from '@/core/shared/api'
import { z } from 'zod'
import {
  adminSecretMissionOverviewItemSchema,
  adminSecretMissionDetailSchema,
  createSecretMissionRequestSchema,
  createSecretMissionResponseSchema,
  updateSecretMissionRequestSchema,
  updateSecretMissionResponseSchema,
  deleteSecretMissionResponseSchema,
  type AdminSecretMissionOverviewItem,
  type AdminSecretMissionDetail,
  type CreateSecretMissionRequest,
  type CreateSecretMissionResponse,
  type UpdateSecretMissionRequest,
} from '../model/adminSecretMission.contract'

export const getAdminSecretMissionOverview = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<AdminSecretMissionOverviewItem[]> => {
  const response = await client.request<unknown>({
    path: `/plugin/secret-mission/races/${raceId}/admin-overview`,
    method: 'GET',
    signal,
  })
  return z.array(adminSecretMissionOverviewItemSchema).parse(response)
}

export const getAdminSecretMissionDetail = async (
  missionId: string,
  signal?: AbortSignal,
): Promise<AdminSecretMissionDetail> => {
  const response = await client.request<unknown>({
    path: `/plugin/secret-mission/${missionId}/admin`,
    method: 'GET',
    signal,
  })
  return adminSecretMissionDetailSchema.parse(response)
}

export const createSecretMission = async (
  request: CreateSecretMissionRequest,
): Promise<CreateSecretMissionResponse> => {
  const validatedPayload = createSecretMissionRequestSchema.parse(request)
  const response = await client.request<unknown>({
    path: '/plugin/secret-mission',
    method: 'POST',
    body: validatedPayload,
  })
  return createSecretMissionResponseSchema.parse(response)
}

export const updateSecretMission = async (
  missionId: string,
  request: UpdateSecretMissionRequest,
): Promise<boolean> => {
  const validatedPayload = updateSecretMissionRequestSchema.parse(request)
  const response = await client.request<unknown>({
    path: `/plugin/secret-mission/${missionId}`,
    method: 'PUT',
    body: validatedPayload,
  })
  return updateSecretMissionResponseSchema.parse(response)
}

export const deleteSecretMission = async (missionId: string): Promise<boolean> => {
  const response = await client.request<unknown>({
    path: `/plugin/secret-mission/${missionId}`,
    method: 'DELETE',
  })
  return deleteSecretMissionResponseSchema.parse(response)
}