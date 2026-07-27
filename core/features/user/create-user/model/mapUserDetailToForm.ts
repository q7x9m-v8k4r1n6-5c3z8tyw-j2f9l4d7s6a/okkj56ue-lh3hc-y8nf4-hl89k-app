import type { UserCategory } from '@/core/entities/user'
import type {
  OrganizerDetailResponse,
  TeamDetailResponse,
} from './userForm.contract'
import {
  DEFAULT_USER_PASSWORD,
  type EditableUser,
} from './userForm'

/** Converts a team or organizer API detail into one frontend form shape. */
export const mapUserDetailToForm = (
  category: UserCategory,
  detail: TeamDetailResponse | OrganizerDetailResponse,
): EditableUser => {
  if (category === 'team') {
    const team = detail as TeamDetailResponse
    return {
      id: team.id,
      displayName: team.name,
      username: team.username,
      password: team.password ?? DEFAULT_USER_PASSWORD,
      email: team.leaderEmail,
      role: '',
      status: team.status,
    }
  }

  const organizer = detail as OrganizerDetailResponse
  return {
    id: organizer.id,
    displayName: organizer.displayName,
    username: organizer.username ?? organizer.email.split('@')[0] ?? '',
    password: organizer.password ?? DEFAULT_USER_PASSWORD,
    email: organizer.email,
    role: organizer.role,
    status: organizer.status,
  }
}
