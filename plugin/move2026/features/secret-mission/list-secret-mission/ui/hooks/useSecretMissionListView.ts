import { useNavigate, useParams } from 'react-router-dom'
import { useSecretMissionOverviewQuery } from '../../model/server/useSecretMissionOverviewQuery'

/**
 * View-model hook cho danh sách nhiệm vụ bí mật.
 * Xử lý routing, data fetching và cung cấp named handlers cho UI.
 */
export const useSecretMissionListView = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const navigate = useNavigate()
  
  const query = useSecretMissionOverviewQuery(raceId)
  
  return {
    missions: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    
    handleBack: () => {
      navigate(`/team/races/${raceId}?tab=more`)
    },
    handleRowClick: (missionId: string) => {
      navigate(`/team/races/${raceId}/secret-missions/${missionId}`)
    }
  }
}