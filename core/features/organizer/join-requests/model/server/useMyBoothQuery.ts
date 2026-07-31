import { useQuery } from '@tanstack/react-query'
import { getMyBooth } from '../../api/joinRequests.api'

export const useMyBoothQuery = (raceId?: string) => {
  return useQuery({
    queryKey: ['organizer-my-booth', raceId],
    queryFn: () => getMyBooth(raceId!),
    enabled: Boolean(raceId), 
    staleTime: 1000 * 60 * 5, //Cache dữ liệu trong 5 phút
  })
}