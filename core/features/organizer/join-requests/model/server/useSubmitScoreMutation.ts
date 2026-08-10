import { submitScore } from '../../../join-requests/api/joinRequests.api'
import { useMyBoothMutation } from './useMyBoothMutation'

export const useSubmitScoreMutation = (raceId?: string) =>
  useMyBoothMutation(raceId, submitScore)
