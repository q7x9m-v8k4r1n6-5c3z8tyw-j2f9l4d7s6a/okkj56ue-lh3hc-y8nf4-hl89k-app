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
  resetPassword?: boolean
}

/** Owns create/update server state and refreshes affected user collections. */
export const useSaveUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ category, mode, form, resetPassword = false }: SaveUserInput) => {
      const commonRequest = {
        displayName: form.displayName,
        username: form.username,
        password: form.password,
        email: form.email,
        status: form.status,
      }
      if (category === 'team') {
        return mode === 'create'
          ? createTeam({
            displayName: form.displayName,
            email: form.email,
          })
          : updateTeam({
            ...commonRequest,
            id: form.id ?? '',
            resetPassword,
          })
      }
      const organizerRequest = {
        ...commonRequest,
        roleIds: form.roleIds,
      }
      return mode === 'create'
        ? createOrganizer(organizerRequest)
        : updateOrganizer({ ...organizerRequest, id: form.id ?? '' })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      void queryClient.invalidateQueries({ queryKey: ['teams'] })
      void queryClient.invalidateQueries({ queryKey: ['organizers'] })
      void queryClient.invalidateQueries({ queryKey: ['user-form'] })
    },
  })
}
