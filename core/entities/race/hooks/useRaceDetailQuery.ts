import { useQuery } from '@tanstack/react-query'
import { getRaceDetail } from '../api'

export const raceDetailQueryKey = (raceId: string) => ['races', 'detail', raceId] as const

/**
 * Query hook thuoc entities/race: trang nao can Race detail thi dung chung hook nay.
 */
export const useRaceDetailQuery = (raceId: string, enabled = true) => {
  return useQuery({
    queryKey: raceDetailQueryKey(raceId),
    queryFn: ({ signal }) => getRaceDetail(raceId, signal),
    enabled: enabled && Boolean(raceId),
  })
}
