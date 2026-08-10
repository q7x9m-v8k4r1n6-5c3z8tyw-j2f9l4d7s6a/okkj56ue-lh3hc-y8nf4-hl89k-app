import { useMutation } from '@tanstack/react-query'
import { acceptEntryToBooth } from '../../api/joinRequests.api'

/** Owns the server mutation that accepts a team into the organizer's booth. */
export const useAcceptEntryMutation = () =>
  useMutation({
    mutationFn: acceptEntryToBooth,
  })
