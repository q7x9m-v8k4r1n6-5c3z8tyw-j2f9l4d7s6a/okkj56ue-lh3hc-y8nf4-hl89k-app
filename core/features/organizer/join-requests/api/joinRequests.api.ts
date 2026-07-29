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
  // 1. Chặn & Kiểm tra dữ liệu gửi đi (Outbound Boundary)
  const validatedPayload = submitScoreRequestSchema.parse(request)

  // 2. Thực hiện Request qua Client chung của dự án
  const response = await client.request<unknown, SubmitScoreRequest>({
    path: '/Booth/submit-score', // Endpoint Backend C#
    method: 'POST',
    body: validatedPayload,
  })

  // 3. Kiểm tra dữ liệu nhận về từ Server (Inbound Boundary)
  return submitScoreResponseSchema.parse(response)
}