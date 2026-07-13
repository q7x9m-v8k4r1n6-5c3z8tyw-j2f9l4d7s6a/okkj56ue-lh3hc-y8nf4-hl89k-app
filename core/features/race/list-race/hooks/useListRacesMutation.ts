import { useQuery } from '@tanstack/react-query'
import { raceQueryKey } from '@/core/features/race/constants'
import { getAllListRaces } from '../api'
import type { ListRacesRequestData } from '../models'

export const useListRacesMutation = (payload: ListRacesRequestData = {}) => {
    return useQuery({
        queryKey: [...raceQueryKey, payload],
        queryFn: ({ signal }) => getAllListRaces(payload, signal),
    })
}

