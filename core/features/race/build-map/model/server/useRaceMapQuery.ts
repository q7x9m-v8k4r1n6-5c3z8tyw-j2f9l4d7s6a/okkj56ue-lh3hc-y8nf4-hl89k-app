import { useQuery } from '@tanstack/react-query'
import { getRaceMapDetail } from '../../api/buildMap.api'
import type { StationItem } from '../buildMap.types'
import { buildMapQueryKeys } from './buildMap.queryKeys'

/**
 * Server state hook to fetch race map details and associated stations.
 */
export const useRaceMapQuery = (raceId?: string) => {
  const query = useQuery({
    queryKey: buildMapQueryKeys.detail(raceId),
    queryFn: ({ signal }) => {
      if (!raceId) throw new Error('Mã trận đấu không tồn tại.')
      return getRaceMapDetail(raceId, signal)
    },
    enabled: Boolean(raceId),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

  const stations: StationItem[] = (query.data?.booth ?? []).map((b) => ({
    id: b.id,
    name: b.name,
    stationType:
      b.stationType || (b.type ? b.type : b.isHidden ? 'Trạm ẩn' : 'Trạm thường'),
    isHidden: b.isHidden,
    place: b.place || 'Chưa có vị trí cụ thể',
    status: b.status || 'free',
    description: b.description ?? '',
  }))

  const mapImageUrl = query.data?.mapImageUrl ?? query.data?.mapUrl ?? null
  const modifiedAt = query.data?.modifiedAt
  const status = query.data?.status?.toLowerCase() ?? 'draft'

  return {
    data: query.data,
    mapImageUrl,
    modifiedAt,
    status,
    stations,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
