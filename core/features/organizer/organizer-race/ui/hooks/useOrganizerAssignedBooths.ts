import { useMemo } from 'react'
import { useAuthSession } from '@/core/features/auth'
import { useOrganizerRaceDetailQuery } from '../../model/server/useOrganizerRaceDetailQuery'

/** Resolves every booth assigned to the current organizer in one race. */
export const useOrganizerAssignedBooths = (raceId?: string) => {
  const raceQuery = useOrganizerRaceDetailQuery(raceId)
  const organizerId = useAuthSession().user?.id

  const boothIds = useMemo(() => {
    if (!organizerId) return []

    return raceQuery.data?.booths
      .filter((booth) => booth.organizerId?.toLowerCase() === organizerId.toLowerCase())
      .map((booth) => booth.id) ?? []
  }, [organizerId, raceQuery.data?.booths])

  return {
    boothIds,
    isError: raceQuery.isError,
    isLoading: raceQuery.isPending,
  }
}
