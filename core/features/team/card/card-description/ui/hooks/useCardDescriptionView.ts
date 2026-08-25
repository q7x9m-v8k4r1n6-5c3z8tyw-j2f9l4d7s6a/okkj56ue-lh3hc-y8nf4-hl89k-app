import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCardDescriptionQuery } from '../../model/server/useCardDescriptionQuery'

export const useCardDescriptionView = () => {
  const { raceId, cardId } = useParams<{ raceId: string; cardId: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as { cardName?: string; cardStatus?: string } | null
  const cardName = state?.cardName ?? 'Thẻ chức năng'
  const cardStatus = state?.cardStatus ?? 'published'

  const query = useCardDescriptionQuery(cardId)

  return {
    cardName,
    cardStatus,
    cardInfo: query.data?.cardInfo,
    isLoading: query.isLoading,
    isError: query.isError,

    handleBack: () => {
      navigate(`/team/races/${raceId}/cards`)
    },
    
    handleUseCard: () => {
      if (cardStatus === 'disabled') {
        alert('Bạn đã sử dụng thẻ này trước đó rồi')
        return
      }
      
      alert('Tính năng này đang phát triển')
    },
  }
}