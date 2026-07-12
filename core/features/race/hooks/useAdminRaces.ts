import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createRace, getAdminRaceDetail, getAdminRaceList, updateRace } from '@/core/features/race/api'
import type { RaceFormPayload } from '@/core/features/race/types'

export const adminRaceListQueryKey = ['races', 'admin-list'] as const
export const adminRaceDetailQueryKey = (raceId: string | number) => ['races', 'admin-detail', String(raceId)] as const

export const useAdminRaceList = () =>
  useQuery({
    queryKey: adminRaceListQueryKey,
    queryFn: getAdminRaceList,
    refetchInterval: 30000,
  })

export const useAdminRaceDetail = (
  raceId: string | number,
  options?: {
    enabled?: boolean
    refetchInterval?: number | false
  },
) =>
  useQuery({
    queryKey: adminRaceDetailQueryKey(raceId),
    queryFn: () => getAdminRaceDetail(raceId),
    enabled: options?.enabled ?? Boolean(raceId),
    refetchInterval: options?.refetchInterval ?? 15000,
  })

export const useCreateRaceMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RaceFormPayload) => createRace(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRaceListQueryKey })
    },
  })
}

export const useUpdateRaceMutation = (raceId: string | number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RaceFormPayload) => updateRace(raceId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRaceListQueryKey })
      void queryClient.invalidateQueries({ queryKey: adminRaceDetailQueryKey(raceId) })
    },
  })
}
