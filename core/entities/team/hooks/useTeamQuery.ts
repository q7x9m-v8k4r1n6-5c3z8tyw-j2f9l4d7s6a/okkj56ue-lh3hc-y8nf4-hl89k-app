import { useQuery } from '@tanstack/react-query'
import { getTeams } from '../api/team.query' 
import { TEAMS_QUERY_KEY } from '@/core/shared'

export const useTeamQuery = () => {
  return useQuery({
    queryKey: TEAMS_QUERY_KEY,
    queryFn: getTeams,
  })
}