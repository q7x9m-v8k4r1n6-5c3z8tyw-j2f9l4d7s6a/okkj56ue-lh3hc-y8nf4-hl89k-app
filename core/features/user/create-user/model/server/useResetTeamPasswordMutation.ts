import { useMutation } from '@tanstack/react-query'
import { resetTeamPassword } from '../../api/userForm.api'

/** Owns the immediate, server-generated team password reset action. */
export const useResetTeamPasswordMutation = () => useMutation({
  mutationFn: resetTeamPassword,
})
