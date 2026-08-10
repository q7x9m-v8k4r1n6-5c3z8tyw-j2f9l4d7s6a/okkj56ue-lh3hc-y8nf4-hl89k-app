import { client } from '@/core/shared/api'
import {
  acceptEntryRequestSchema,
  boothOperationResponseSchema,
  cancelBoothSessionRequestSchema,
  submitScoreRequestSchema,
  type AcceptEntryRequest,
  type BoothOperationResponse,
  type CancelBoothSessionRequest,
  type SubmitScoreRequest,
} from '../model/organizerScoring.contract'

/** Gửi điểm chấm trạm thi và validate dữ liệu ở 2 đầu ranh giới API */
export const submitScore = async (
  request: SubmitScoreRequest,
): Promise<BoothOperationResponse> => {
  const validatedPayload = submitScoreRequestSchema.parse(request)

  const response = await client.request<unknown, SubmitScoreRequest>({
    path: '/Booth/submit-score',
    method: 'POST',
    body: validatedPayload,
  })

  return boothOperationResponseSchema.parse(response)
}

/** Accepts the pending team after validating both request and response boundaries. */
export const acceptEntryToBooth = async (
  request: AcceptEntryRequest,
): Promise<BoothOperationResponse> => {
  const validatedPayload = acceptEntryRequestSchema.parse(request)
  const response = await client.request<unknown, AcceptEntryRequest>({
    path: '/Booth/accept-entry',
    method: 'POST',
    body: validatedPayload,
  })

  return boothOperationResponseSchema.parse(response)
}

/** Cancels an occupied booth session so the team is kicked and the booth is released. */
export const cancelBoothSession = async (
  request: CancelBoothSessionRequest,
): Promise<BoothOperationResponse> => {
  const validatedRequest = cancelBoothSessionRequestSchema.parse(request)
  const response = await client.request<unknown>({
    path: `/Booth/${validatedRequest.boothId}/cancel-session`,
    method: 'POST',
  })

  return boothOperationResponseSchema.parse(response)
}
