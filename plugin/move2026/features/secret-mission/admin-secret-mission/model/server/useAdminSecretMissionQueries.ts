import { useQuery } from '@tanstack/react-query'
import { getAdminSecretMissionOverview, getAdminSecretMissionDetail } from '../../api/adminSecretMission.api'
import { adminSecretMissionQueryKeys } from '../adminSecretMission.queryKeys'

export const useAdminSecretMissionOverviewQuery = (raceId?: string) =>
  useQuery({
    queryKey: adminSecretMissionQueryKeys.overview(raceId),
    queryFn: ({ signal }) => getAdminSecretMissionOverview(raceId!, signal),
    enabled: Boolean(raceId),
  })

export const useAdminSecretMissionDetailQuery = (missionId?: string) =>
  useQuery({
    queryKey: adminSecretMissionQueryKeys.detail(missionId),
    queryFn: ({ signal }) => getAdminSecretMissionDetail(missionId!, signal),
    enabled: Boolean(missionId),
  })