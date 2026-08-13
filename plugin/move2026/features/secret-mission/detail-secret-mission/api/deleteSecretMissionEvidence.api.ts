import { client } from '@/core/shared/api'

export const deleteSecretMissionEvidence = async (
  missionId: string,
  fileId: string,
  signal?: AbortSignal
): Promise<void> => {
  await client.request<unknown>({
    path: `/plugin/secret-mission/${missionId}/evidence/${fileId}`,
    method: 'DELETE',
    signal,
  })
}