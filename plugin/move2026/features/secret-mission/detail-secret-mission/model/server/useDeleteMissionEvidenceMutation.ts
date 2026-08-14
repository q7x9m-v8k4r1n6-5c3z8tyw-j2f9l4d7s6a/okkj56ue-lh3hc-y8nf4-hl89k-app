import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteSecretMissionEvidence } from '../../api/deleteSecretMissionEvidence.api'
import { secretMissionDetailQueryKeys } from './secretMissionDetail.queryKeys'
import { secretMissionQueryKeys } from '../../../list-secret-mission/model/server/secretMission.queryKeys'

export const useDeleteMissionEvidenceMutation = (missionId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => deleteSecretMissionEvidence(missionId, fileId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: secretMissionDetailQueryKeys.detail(missionId),
      })
      void queryClient.invalidateQueries({
        queryKey: secretMissionQueryKeys.overview(),
      })
    },
  })
}