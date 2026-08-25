import { useQuery } from '@tanstack/react-query'
import { getTeamCardList } from '../../api/getCardList.api'
import { cardListQueryKeys } from './cardList.queryKeys'

export const useCardListQuery = (raceId?: string) =>
  useQuery({
    queryKey: cardListQueryKeys.list(raceId),
    queryFn: ({ signal }) => getTeamCardList(raceId!, signal),
    enabled: Boolean(raceId),
  })