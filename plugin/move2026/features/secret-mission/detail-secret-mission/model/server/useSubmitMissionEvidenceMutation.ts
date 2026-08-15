import { useMutation, useQueryClient } from '@tanstack/react-query'
import { submitSecretMissionEvidence } from '../../api/submitSecretMissionEvidence.api'
import { secretMissionDetailQueryKeys } from './secretMissionDetail.queryKeys'
import { secretMissionQueryKeys } from '../../../list-secret-mission/model/server/secretMission.queryKeys'

export const useSubmitMissionEvidenceMutation = (missionId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => submitSecretMissionEvidence(missionId, file),
    onSuccess: () => {
      // Refresh lại chi tiết nhiệm vụ và danh sách tổng quan sau khi up thành công
      void queryClient.invalidateQueries({
        queryKey: secretMissionDetailQueryKeys.detail(missionId),
      })
      void queryClient.invalidateQueries({
        queryKey: secretMissionQueryKeys.overview(),
      })
    },
  })
}