import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UserCategory } from '@/core/entities/user'
import { deleteOrganizer, deleteTeam } from '../../api/userList.api'
import { userListQueryKeys } from './userList.queryKeys'

/** Owns delete-user server state and refreshes the management collection. */
export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ category, userId }: {
      category: UserCategory
      userId: string
    }) => category === 'team'
      ? deleteTeam(userId)
      : deleteOrganizer(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userListQueryKeys.all })
    },
  })
}
