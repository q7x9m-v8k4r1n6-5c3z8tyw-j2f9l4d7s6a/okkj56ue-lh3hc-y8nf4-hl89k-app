import { useMutation, useQueryClient } from '@tanstack/react-query'
import { claimSecretMission } from '../../api/claimSecretMission.api'
import { secretMissionQueryKeys } from '../../../list-secret-mission/model/server/secretMission.queryKeys'

export const useClaimSecretMissionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (missionId: string) => claimSecretMission(missionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: secretMissionQueryKeys.overview(),
      })
    },
  })
}