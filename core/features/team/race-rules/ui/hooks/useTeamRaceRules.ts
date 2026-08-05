import { useParams } from 'react-router-dom'
import { useRaceRulesQuery } from '../../model/server/useRaceRulesQuery'

/**
 * Exposes the current race's rules text by reading raceId from the route
 * itself, so the page composing this feature never passes it as a prop.
 */
export const useTeamRaceRules = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const rulesQuery = useRaceRulesQuery(raceId)

  return {
    isLoading: rulesQuery.isLoading,
    isError: rulesQuery.isError,
    rules: rulesQuery.data?.rules ?? '',
  }
}