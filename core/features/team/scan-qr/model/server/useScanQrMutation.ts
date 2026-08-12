import { useMutation, useQueryClient } from '@tanstack/react-query'
import { invalidateTeamBoothSession } from '@/core/entities/booth'
import { submitScanQr } from '../../api/scanQr.api'
import type { ScanQrRequest } from '../scanQr.contract'

export const useScanQrMutation = (raceId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ScanQrRequest) => submitScanQr(payload),
    onSuccess: () => invalidateTeamBoothSession(queryClient, raceId),
  })
}
