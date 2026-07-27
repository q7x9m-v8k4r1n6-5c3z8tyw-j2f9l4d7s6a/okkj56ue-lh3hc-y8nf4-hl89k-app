import { useQuery } from '@tanstack/react-query'
import { getTeams } from '../../api/team.api'
import { teamQueryKeys } from './team.queryKeys'

/**
 * Loads reusable team search results from server state.
 */
export const useTeamQuery = (searchQuery = '') =>
  useQuery({
    queryKey: teamQueryKeys.search(searchQuery),
    queryFn: ({ signal }) => getTeams(searchQuery, signal),
  })
