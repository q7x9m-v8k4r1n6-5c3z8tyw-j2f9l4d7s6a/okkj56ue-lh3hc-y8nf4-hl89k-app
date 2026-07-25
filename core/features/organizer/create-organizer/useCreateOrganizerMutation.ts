import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateOrganizerPayload } from '@/core/entities/organizer/models/organizer.type'
import { createOrganizer } from '@/core/entities/organizer/api'
import { buildStaffIdentityFromEmail, DEFAULT_USER_PASSWORD } from '@/core/entities/user/helpers'

export const useCreateOrganizerMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateOrganizerPayload) => {
      const { email, role } = payload
      const { username, displayName } = buildStaffIdentityFromEmail(email)
      
      return createOrganizer({
        email,
        role,
        username,
        displayName: 'Giám khảo',
        password: DEFAULT_USER_PASSWORD,
        status: 'active'
      })
    },
    onSuccess: () => {
      // Invalidate organizer list query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['organizers'] }) // Ensure this key matches your list query
    },
  })
}
