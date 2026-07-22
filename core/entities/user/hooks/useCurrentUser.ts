import { useQuery } from '@tanstack/react-query'
import { client } from '@/core/shared/api/interceptor'
import type { CurrentUser } from '@/core/entities/user/model'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: ({ signal }) => client.request<CurrentUser>({
      path: '/auth/me',
      method: 'GET',
      signal,
    }),
    staleTime: Number.POSITIVE_INFINITY,
  })
}
