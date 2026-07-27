import { useQuery } from '@tanstack/react-query'
import type { UserCategory } from '@/core/entities/user'
import {
  getOrganizerDetail,
  getTeamDetail,
} from '../../api/userForm.api'
import { mapUserDetailToForm } from '../mapUserDetailToForm'
import { userFormQueryKeys } from './userForm.queryKeys'

/** Owns backend detail state used to initialize an edit-user form. */
export const useUserDetailQuery = (
  category: UserCategory,
  userId: string,
  enabled: boolean,
) => useQuery({
  queryKey: userFormQueryKeys.detail(category, userId),
  queryFn: async ({ signal }) => {
    const detail = category === 'team'
      ? await getTeamDetail(userId, signal)
      : await getOrganizerDetail(userId, signal)
    return mapUserDetailToForm(category, detail)
  },
  enabled,
})
