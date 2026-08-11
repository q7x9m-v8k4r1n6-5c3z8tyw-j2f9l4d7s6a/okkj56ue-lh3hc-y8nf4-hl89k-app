import { acceptEntryToBooth } from '../../api/joinRequests.api'
import { useMyBoothMutation } from './useMyBoothMutation'

/** Owns the server mutation that accepts a team into the organizer's booth. */
export const useAcceptEntryMutation = (raceId?: string) =>
  useMyBoothMutation(raceId, acceptEntryToBooth)
