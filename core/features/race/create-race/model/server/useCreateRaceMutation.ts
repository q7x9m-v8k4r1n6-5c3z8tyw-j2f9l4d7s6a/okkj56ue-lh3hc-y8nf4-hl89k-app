import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRace } from '../../api/createRace.api'
import type { CreateRaceRequest } from '../createRace.contract'

type CreateRaceMutationInput = {
  request: CreateRaceRequest
  coverImage: File | null
}

/** Owns create-race server state and refreshes cached race collections. */
export const useCreateRaceMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ request, coverImage }: CreateRaceMutationInput) =>
      createRace(request, coverImage),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['races'] })
    },
  })
}
