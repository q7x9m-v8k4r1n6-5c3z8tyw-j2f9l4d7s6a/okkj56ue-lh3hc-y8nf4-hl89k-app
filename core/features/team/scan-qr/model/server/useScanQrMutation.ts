import { useMutation } from '@tanstack/react-query'
import { submitScanQr } from '../../api/scanQr.api'
import type { ScanQrRequest } from '../scanQr.contract'

export const useScanQrMutation = () => {
  return useMutation({
    mutationFn: (payload: ScanQrRequest) => submitScanQr(payload),
  })
}