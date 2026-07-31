import { client } from '@/core/shared/api'
import {
  updateTeamScoreRequestSchema,
  updateTeamScoreResponseSchema,
  type UpdateTeamScoreRequest,
  type UpdateTeamScoreResponse,
} from '../model/editScore.schema'

export const updateTeamScore = async (
  raceId: string,
  teamId: string,
  request: UpdateTeamScoreRequest,
): Promise<UpdateTeamScoreResponse> => {
  const payload = updateTeamScoreRequestSchema.parse(request)
  const response = await client.request<unknown, UpdateTeamScoreRequest>({
    path: `/Race/${raceId}/teams/${teamId}/score`,
    method: 'PATCH',
    body: payload,
  })

  return updateTeamScoreResponseSchema.parse(response)
}
