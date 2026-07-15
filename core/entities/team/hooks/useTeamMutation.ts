import { useQuery } from '@tanstack/react-query'
import { getTeams } from '../api'

export const useTeamMutation = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: getTeams,
  })
}
