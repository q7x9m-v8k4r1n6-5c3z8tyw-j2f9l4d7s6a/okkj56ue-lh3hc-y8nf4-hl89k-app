import { client } from '@/core/shared/api'
import {
  submitScoreRequestSchema,
  submitScoreResponseSchema,
  type SubmitScoreRequest,
  type SubmitScoreResponse,
} from '../model/organizerScoring.contract'

/** Gửi điểm chấm trạm thi và validate dữ liệu ở 2 đầu ranh giới API */
export const submitScore = async (
  request: SubmitScoreRequest,
): Promise<SubmitScoreResponse> => {
  const validatedPayload = submitScoreRequestSchema.parse(request)

  const response = await client.request<unknown, SubmitScoreRequest>({
    path: '/Booth/submit-score',
    method: 'POST',
    body: validatedPayload,
  })

  return submitScoreResponseSchema.parse(response)
}

export const acceptEntryToBooth = async (payload: { boothId: string; teamId: string }) => {
  return await client.request<{ message: string }>({
    path: '/Booth/accept-entry',
    method: 'POST',
    body: payload,
  })
}