import { useMutation } from '@tanstack/react-query'
import { cancelBoothSession } from '../../api/joinRequests.api'

/** Owns the server mutation that kicks the active team and releases the booth. */
export const useCancelBoothSessionMutation = () =>
  useMutation({
    mutationFn: cancelBoothSession,
  })
