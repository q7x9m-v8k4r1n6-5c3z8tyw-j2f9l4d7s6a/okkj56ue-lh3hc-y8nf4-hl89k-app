import {
  useMutation,
  useQueryClient,
  type MutationFunction,
} from '@tanstack/react-query'
import { invalidateMyBooth } from '@/core/entities/booth'

export const useMyBoothMutation = <TData, TVariables>(
  raceId: string | undefined,
  mutationFn: MutationFunction<TData, TVariables>,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => invalidateMyBooth(queryClient, raceId),
  })
}
