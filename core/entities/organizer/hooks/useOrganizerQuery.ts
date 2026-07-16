import { useQuery } from '@tanstack/react-query'
import { getOrganizers } from '../api/organizer.query'
import { ORGANIZERS_QUERY_KEY } from '@/core/shared' 

export const useOrganizerQuery = () => {
  return useQuery({
    queryKey: ORGANIZERS_QUERY_KEY,
    queryFn: getOrganizers,
  })
}