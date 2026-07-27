import type { UserCategory, UserSummary } from '@/core/entities/user'
import type {
  ListOrganizersResponse,
  ListTeamsResponse,
} from './userList.contract'

/** Maps feature API rows into the canonical user entity rendered by the table. */
export const mapUserListToSummaries = (
  category: UserCategory,
  teams: ListTeamsResponse['items'],
  organizers: ListOrganizersResponse['items'],
): UserSummary[] => category === 'team'
  ? teams.map((team) => ({
    id: team.id,
    category: 'team',
    displayName: team.name,
    username: team.username,
    status: team.status,
    email: team.leaderEmail,
  }))
  : organizers.map((organizer) => ({
    id: organizer.id,
    category: 'staff',
    displayName: organizer.displayName,
    username: organizer.email.split('@')[0] ?? '',
    status: organizer.status,
    email: organizer.email,
  }))
