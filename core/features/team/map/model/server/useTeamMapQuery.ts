import { useQuery } from '@tanstack/react-query'
import { getTeamRaceMapDetail, getTeamBoothList } from '../../api/teamMap.api'
import { mapTeamMapData } from '../mapTeamMapData'
import { teamMapQueryKeys } from './teamMap.queryKeys'
import type { TeamMapData } from '../teamMap.types'

/**
 * TanStack Query hook combining race map details and placed booth coordinates.
 */
export const useTeamMapQuery = (raceId?: string) => {
  const raceDetailQuery = useQuery({
    queryKey: teamMapQueryKeys.detail(raceId),
    queryFn: ({ signal }) => {
      if (!raceId) throw new Error('Mã trận đấu không tồn tại.')
      return getTeamRaceMapDetail(raceId, signal)
    },
    enabled: Boolean(raceId),
    staleTime: 1000 * 60 * 2,
  })

  const boothListQuery = useQuery({
    queryKey: teamMapQueryKeys.booths(raceId),
    queryFn: ({ signal }) => {
      if (!raceId) throw new Error('Mã trận đấu không tồn tại.')
      return getTeamBoothList(raceId, signal)
    },
    enabled: Boolean(raceId),
    staleTime: 1000 * 60 * 2,
  })

  const isLoading = raceDetailQuery.isLoading || boothListQuery.isLoading
  const isError = raceDetailQuery.isError || boothListQuery.isError
  const error = raceDetailQuery.error || boothListQuery.error

  const teamMapData: TeamMapData = mapTeamMapData(raceDetailQuery.data, boothListQuery.data)

  const refetch = async () => {
    await Promise.all([raceDetailQuery.refetch(), boothListQuery.refetch()])
  }

  return {
    data: teamMapData,
    raceName: teamMapData.raceName,
    mapImageUrl: teamMapData.mapImageUrl,
    stations: teamMapData.stations,
    placedStations: teamMapData.stations,
    isEmpty: teamMapData.isEmpty,
    isLoading,
    isError,
    error,
    refetch,
  }
}
