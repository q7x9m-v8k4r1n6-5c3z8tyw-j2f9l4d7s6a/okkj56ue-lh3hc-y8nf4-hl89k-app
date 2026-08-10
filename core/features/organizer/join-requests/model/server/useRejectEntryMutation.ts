import { useMutation } from '@tanstack/react-query'
import { rejectEntryToBooth } from '../../api/joinRequests.api'

/** Owns the server mutation that rejects a pending team entry request. */
export const useRejectEntryMutation = () =>
  useMutation({
    mutationFn: rejectEntryToBooth,
  })
