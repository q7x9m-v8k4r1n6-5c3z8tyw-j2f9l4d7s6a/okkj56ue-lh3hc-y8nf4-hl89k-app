import { cancelBoothSession } from '../../api/joinRequests.api'
import { useMyBoothMutation } from './useMyBoothMutation'

/** Owns the server mutation that kicks the active team and releases the booth. */
export const useCancelBoothSessionMutation = (raceId?: string) =>
  useMyBoothMutation(raceId, cancelBoothSession)
