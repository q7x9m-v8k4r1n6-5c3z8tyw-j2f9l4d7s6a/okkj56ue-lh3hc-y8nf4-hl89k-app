import type { QueryClient } from '@tanstack/react-query'
import { myBoothQueryKeys } from './myBooth.queryKeys'

export const invalidateMyBooth = (
  queryClient: QueryClient,
  raceId?: string,
) => queryClient.invalidateQueries({
  queryKey: myBoothQueryKeys.detail(raceId),
})
