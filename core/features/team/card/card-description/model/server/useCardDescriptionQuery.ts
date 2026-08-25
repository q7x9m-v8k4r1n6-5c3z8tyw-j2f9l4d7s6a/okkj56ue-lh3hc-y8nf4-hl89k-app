import { useQuery } from '@tanstack/react-query'
import { getTeamCardDescription } from '../../api/getCardDescription.api'
import { cardDescriptionQueryKeys } from './cardDescription.queryKeys'

export const useCardDescriptionQuery = (cardId?: string) =>
  useQuery({
    queryKey: cardDescriptionQueryKeys.detail(cardId),
    queryFn: ({ signal }) => getTeamCardDescription(cardId!, signal),
    enabled: Boolean(cardId),
  })