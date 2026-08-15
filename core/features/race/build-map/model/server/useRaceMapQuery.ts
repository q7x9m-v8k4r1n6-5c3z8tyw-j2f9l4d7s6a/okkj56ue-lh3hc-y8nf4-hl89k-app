import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getRaceBoothList, getRaceMapDetail } from '../../api/buildMap.api'
import {
  mapBoothListToStations,
  mapRaceDetailBoothsToStations,
} from '../mapBoothListToStations'
import type { StationItem } from '../buildMap.types'
import { buildMapQueryKeys } from './buildMap.queryKeys'

/**
 * Server state hook to fetch race map details and associated stations in parallel.
 */
export const useRaceMapQuery = (raceId?: string) => {
  const detailQuery = useQuery({
    queryKey: buildMapQueryKeys.detail(raceId),
    queryFn: ({ signal }) => {
      if (!raceId) throw new Error('Mã trận đấu không tồn tại.')
      return getRaceMapDetail(raceId, signal)
    },
    enabled: Boolean(raceId),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  })

  const boothQuery = useQuery({
    queryKey: buildMapQueryKeys.booths(raceId),
    queryFn: ({ signal }) => {
      if (!raceId) throw new Error('Mã trận đấu không tồn tại.')
      return getRaceBoothList(raceId, signal)
    },
    enabled: Boolean(raceId),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  })

  const boothData = boothQuery.data
  const detailBooths = detailQuery.data?.booth

  const stations: StationItem[] = useMemo(() => {
    if (boothData && boothData.length > 0) {
      return mapBoothListToStations(boothData)
    }
    if (detailBooths && detailBooths.length > 0) {
      return mapRaceDetailBoothsToStations(detailBooths)
    }
    return []
  }, [boothData, detailBooths])

  const mapImageUrl =
    detailQuery.data?.mapImageUrl ?? detailQuery.data?.mapUrl ?? null
  const modifiedAt = detailQuery.data?.modifiedAt
  const status = detailQuery.data?.status?.toLowerCase() ?? 'draft'
  const isDraft = status === 'draft'

  return {
    data: detailQuery.data,
    detail: detailQuery.data,
    booths: boothQuery.data ?? [],
    stations,
    mapImageUrl,
    modifiedAt,
    status,
    isDraft,
    isLoading: detailQuery.isLoading || (Boolean(raceId) && boothQuery.isLoading),
    isError: detailQuery.isError || boothQuery.isError,
    error: detailQuery.error ?? boothQuery.error,
    refetch: async () => {
      await Promise.all([detailQuery.refetch(), boothQuery.refetch()])
    },
  }
}
