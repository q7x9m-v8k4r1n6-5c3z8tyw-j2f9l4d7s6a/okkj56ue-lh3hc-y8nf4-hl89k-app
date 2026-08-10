import { client } from '@/core/shared/api'
import {
  acceptEntryRequestSchema,
  boothOperationResponseSchema,
  cancelBoothSessionRequestSchema,
  rejectEntryRequestSchema,
  submitScoreRequestSchema,
  type AcceptEntryRequest,
  type BoothOperationResponse,
  type CancelBoothSessionRequest,
  type RejectEntryRequest,
  type SubmitScoreRequest,
} from '../model/organizerScoring.contract'

export const submitScore = async (
  request: SubmitScoreRequest,
): Promise<BoothOperationResponse> => {
  const payload = submitScoreRequestSchema.parse(request)
  const response = await client.request<unknown, SubmitScoreRequest>({
    path: '/Booth/submit-score',
    method: 'POST',
    body: payload,
  })

  return boothOperationResponseSchema.parse(response)
}

export const acceptEntryToBooth = async (
  request: AcceptEntryRequest,
): Promise<BoothOperationResponse> => {
  const payload = acceptEntryRequestSchema.parse(request)
  const response = await client.request<unknown, AcceptEntryRequest>({
    path: '/Booth/accept-entry',
    method: 'POST',
    body: payload,
  })

  return boothOperationResponseSchema.parse(response)
}

export const rejectEntryToBooth = async (
  request: RejectEntryRequest,
): Promise<BoothOperationResponse> => {
  const payload = rejectEntryRequestSchema.parse(request)
  const response = await client.request<unknown, RejectEntryRequest>({
    path: '/Booth/reject-entry',
    method: 'POST',
    body: payload,
  })

  return boothOperationResponseSchema.parse(response)
}

export const cancelBoothSession = async (
  request: CancelBoothSessionRequest,
): Promise<BoothOperationResponse> => {
  const payload = cancelBoothSessionRequestSchema.parse(request)
  const response = await client.request<unknown>({
    path: `/Booth/${payload.boothId}/cancel-session`,
    method: 'POST',
  })

  return boothOperationResponseSchema.parse(response)
}
