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
import { myBoothDataSchema, type MyBoothData } from '../model/myBooth.contract'

/** Loads the organizer's single booth and its durable pending/occupied state. */
export const getMyBooth = async (
  raceId: string,
  signal?: AbortSignal,
): Promise<MyBoothData> => {
  const response = await client.request<unknown>({
    path: '/Booth/my-booth',
    method: 'GET',
    query: { raceId },
    signal,
  })

  return myBoothDataSchema.parse(response)
}

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

/** Rejects a pending booth-entry request and notifies the requesting team. */
export const rejectEntryToBooth = async (
  request: RejectEntryRequest,
): Promise<BoothOperationResponse> => {
  const validatedPayload = rejectEntryRequestSchema.parse(request)
  const response = await client.request<unknown, RejectEntryRequest>({
    path: '/Booth/reject-entry',
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
