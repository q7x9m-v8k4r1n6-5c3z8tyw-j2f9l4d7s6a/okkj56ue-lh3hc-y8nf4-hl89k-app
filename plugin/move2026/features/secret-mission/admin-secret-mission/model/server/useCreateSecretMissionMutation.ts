import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createSecretMission,
  updateSecretMission,
  deleteSecretMission,
} from '../../api/adminSecretMission.api'
import { adminSecretMissionQueryKeys } from '../adminSecretMission.queryKeys'
import type { CreateSecretMissionRequest, UpdateSecretMissionRequest } from '../adminSecretMission.contract'

export const useCreateSecretMissionMutation = (raceId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSecretMissionRequest) => createSecretMission(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminSecretMissionQueryKeys.overview(raceId) })
    },
  })
}

export const useUpdateSecretMissionMutation = (raceId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ missionId, payload }: { missionId: string; payload: UpdateSecretMissionRequest }) =>
      updateSecretMission(missionId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminSecretMissionQueryKeys.overview(raceId) })
      void queryClient.invalidateQueries({ queryKey: adminSecretMissionQueryKeys.detail(variables.missionId) })
    },
  })
}

export const useDeleteSecretMissionMutation = (raceId?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (missionId: string) => deleteSecretMission(missionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminSecretMissionQueryKeys.overview(raceId) })
    },
  })
}