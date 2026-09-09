import { useMutation, useQueryClient } from '@tanstack/react-query'
import { verifyMissionCode, submitTechCacheResult } from '../../api/techcache.api'
import { secretMissionDetailQueryKeys } from './secretMissionDetail.queryKeys'
import { secretMissionQueryKeys } from '../../../list-secret-mission/model/server/secretMission.queryKeys'
import type { TechCacheResultType } from '../techcache.contract'

export const useVerifyMissionCodeMutation = () =>
  useMutation({
    mutationFn: ({ missionId, code }: { missionId: string; code: string }) =>
      verifyMissionCode(missionId, code),
  })

export const useSubmitTechCacheResultMutation = (missionId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ code, result, video }: { code: string; result: TechCacheResultType; video: File }) =>
      submitTechCacheResult(missionId, code, result, video),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: secretMissionDetailQueryKeys.detail(missionId) })
      void queryClient.invalidateQueries({ queryKey: secretMissionQueryKeys.overview() })
    },
  })
}