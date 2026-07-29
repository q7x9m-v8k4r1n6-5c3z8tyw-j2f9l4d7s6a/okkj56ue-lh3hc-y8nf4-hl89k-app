import { useMutation } from '@tanstack/react-query'
import { submitScore } from '../../../join-requests/api/joinRequests.api'

export const useSubmitScoreMutation = () => {
  return useMutation({
    mutationFn: submitScore,
  })
}