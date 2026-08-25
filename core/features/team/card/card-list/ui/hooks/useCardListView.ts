import { useNavigate, useParams } from 'react-router-dom'
import { useCardListQuery } from '../../model/server/useCardListQuery'

export const useCardListView = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const navigate = useNavigate()

  const query = useCardListQuery(raceId)

  return {
    cards: query.data,
    isLoading: query.isLoading,
    isError: query.isError,

    handleBack: () => {
      navigate(`/team/races/${raceId}?tab=more`)
    },
    handleCardClick: (card: import('../../model/cardList.contract').CardItemDto) => {
      navigate(`/team/races/${raceId}/cards/${card.cardId}`, {
        state: { cardName: card.cardName, cardStatus: card.cardStatus }
      })
    },
  }
}