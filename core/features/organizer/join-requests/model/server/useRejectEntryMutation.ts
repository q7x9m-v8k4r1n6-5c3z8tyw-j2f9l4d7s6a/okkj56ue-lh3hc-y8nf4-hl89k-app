import { rejectEntryToBooth } from '../../api/joinRequests.api'
import { useMyBoothMutation } from './useMyBoothMutation'

/** Owns the server mutation that rejects a pending team entry request. */
export const useRejectEntryMutation = (raceId?: string) =>
  useMyBoothMutation(raceId, rejectEntryToBooth)
