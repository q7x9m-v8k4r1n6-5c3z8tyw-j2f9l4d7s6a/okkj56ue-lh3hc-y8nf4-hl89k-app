import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/core/features/auth/api'

export const currentUserQueryKey = ['auth', 'current-user'] as const

export const useCurrentUser = () =>
  useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    staleTime: Number.POSITIVE_INFINITY,
  })
