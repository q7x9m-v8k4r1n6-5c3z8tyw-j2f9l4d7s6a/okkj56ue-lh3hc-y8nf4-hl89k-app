import { useQuery } from '@tanstack/react-query'
import { getOrganizers } from '../api'

export const useOrganizerMutation = () => {
    return useQuery({
        queryKey: ['organizers'],
        queryFn: getOrganizers,
    })
}