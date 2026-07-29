import { client } from '@core/shared/api'
import {
  scanQrRequestSchema,
  scanQrResponseSchema,
  type ScanQrRequest,
  type ScanQrResponse,
} from '../model/scanQr.contract'

export const submitScanQr = async (
  request: ScanQrRequest,
): Promise<ScanQrResponse> => {
  const validatedPayload = scanQrRequestSchema.parse(request)

  const response = await client.request<unknown>({
    path: '/Booth/entry-request', // Endpoint Backend C#
    method: 'POST',
    body: validatedPayload,
  })

  return scanQrResponseSchema.parse(response)
}