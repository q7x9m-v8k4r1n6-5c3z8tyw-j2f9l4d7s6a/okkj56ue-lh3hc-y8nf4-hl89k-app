import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTeamScore } from '../../api/editScore.api'
import { liveRaceQueryKeys } from '../../../model/server/liveRace.queryKeys'
import {
  updateTeamScoreRequestSchema,
  type UpdateTeamScoreRequest,
} from '../editScore.schema'

type UpdateTeamScoreVariables = {
  teamId: string
  payload: UpdateTeamScoreRequest
}

export const useUpdateTeamScoreMutation = (raceId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ teamId, payload }: UpdateTeamScoreVariables) => {
      if (!raceId) throw new Error('Không tìm thấy mã trận đấu.')
      return updateTeamScore(
        raceId,
        teamId,
        updateTeamScoreRequestSchema.parse(payload),
      )
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: liveRaceQueryKeys.all,
      })
    },
  })
}
