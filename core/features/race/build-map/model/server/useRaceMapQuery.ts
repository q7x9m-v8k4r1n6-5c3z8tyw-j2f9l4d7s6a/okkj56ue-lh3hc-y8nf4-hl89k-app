import { useQuery } from '@tanstack/react-query'
import { getRaceBooths, getRaceMapDetail } from '../../api/buildMap.api'
import { buildMapQueryKeys } from './buildMap.queryKeys'

/**
 * Query options factory for race map detail.
 */
export const getRaceMapDetailQueryOptions = (raceId?: string) => ({
  queryKey: buildMapQueryKeys.mapDetail(raceId),
  queryFn: ({ signal }: { signal?: AbortSignal }) =>
    getRaceMapDetail(raceId ?? '', signal),
  enabled: Boolean(raceId && raceId.trim()),
})

/**
 * Query options factory for race booths list.
 */
export const getRaceBoothsQueryOptions = (raceId?: string) => ({
  queryKey: buildMapQueryKeys.booths(raceId),
  queryFn: ({ signal }: { signal?: AbortSignal }) =>
    getRaceBooths(raceId ?? '', signal),
  enabled: Boolean(raceId && raceId.trim()),
})

/**
 * React Query hook managing server state for race map details and booths list.
 */
export const useRaceMapQuery = (raceId?: string) => {
  const mapDetailQuery = useQuery(getRaceMapDetailQueryOptions(raceId))
  const boothsQuery = useQuery(getRaceBoothsQueryOptions(raceId))

  return {
    mapDetail: mapDetailQuery.data,
    mapImageUrl: mapDetailQuery.data?.mapImageUrl ?? null,
    booths: boothsQuery.data ?? [],
    isLoadingMap: mapDetailQuery.isLoading,
    isLoadingBooths: boothsQuery.isLoading,
    isLoading: mapDetailQuery.isLoading || boothsQuery.isLoading,
    isErrorMap: mapDetailQuery.isError,
    isErrorBooths: boothsQuery.isError,
    isError: mapDetailQuery.isError || boothsQuery.isError,
    mapError: mapDetailQuery.error,
    boothsError: boothsQuery.error,
    refetchMap: mapDetailQuery.refetch,
    refetchBooths: boothsQuery.refetch,
  }
}
