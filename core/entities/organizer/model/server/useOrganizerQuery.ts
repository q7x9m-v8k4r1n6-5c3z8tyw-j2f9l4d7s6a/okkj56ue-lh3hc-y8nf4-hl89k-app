import { useQuery } from '@tanstack/react-query'
import { getOrganizers } from '../../api/organizer.api'
import { organizerQueryKeys } from './organizer.queryKeys'

/**
 * Loads reusable organizer search results from server state.
 */
export const useOrganizerQuery = (searchQuery = '') =>
  useQuery({
    queryKey: organizerQueryKeys.search(searchQuery),
    queryFn: ({ signal }) => getOrganizers(searchQuery, signal),
  })
