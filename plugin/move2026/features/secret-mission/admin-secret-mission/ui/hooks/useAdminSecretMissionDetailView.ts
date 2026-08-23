import { useAdminSecretMissionDetailQuery } from '../../model/server/useAdminSecretMissionQueries'

export const useAdminSecretMissionDetailView = (missionId: string) => {
  const query = useAdminSecretMissionDetailQuery(missionId)

  return {
    mission: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}