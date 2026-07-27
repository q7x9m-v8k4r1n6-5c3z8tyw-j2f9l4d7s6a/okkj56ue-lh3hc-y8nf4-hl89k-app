import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UserCategory } from '@/core/entities/user'
import {
  createOrganizer,
  createTeam,
  updateOrganizer,
  updateTeam,
} from '../../api/userForm.api'
import type { EditableUser, UserFormMode } from '../userForm'

type SaveUserInput = {
  category: UserCategory
  mode: UserFormMode
  form: EditableUser
}

/** Owns create/update server state and refreshes affected user collections. */
export const useSaveUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ category, mode, form }: SaveUserInput) => {
      const commonRequest = {
        displayName: form.displayName,
        username: form.username,
        password: form.password,
        email: form.email,
        status: form.status,
      }
      if (category === 'team') {
        return mode === 'create'
          ? createTeam(commonRequest)
          : updateTeam({ ...commonRequest, id: form.id ?? '' })
      }
      const organizerRequest = {
        ...commonRequest,
        role: form.role || 'coordinator' as const,
      }
      return mode === 'create'
        ? createOrganizer(organizerRequest)
        : updateOrganizer({ ...organizerRequest, id: form.id ?? '' })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      void queryClient.invalidateQueries({ queryKey: ['teams'] })
      void queryClient.invalidateQueries({ queryKey: ['organizers'] })
    },
  })
}
