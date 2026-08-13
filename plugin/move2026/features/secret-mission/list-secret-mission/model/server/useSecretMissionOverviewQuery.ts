import { useQuery } from '@tanstack/react-query'
import { getSecretMissionOverview } from '../../api/listSecretMission.api'
import { secretMissionQueryKeys } from './secretMission.queryKeys'
import { mapOverviewDtoToFrontendModel } from '../listSecretMission.contract'

export const useSecretMissionOverviewQuery = (raceId?: string) =>
  useQuery({
    queryKey: secretMissionQueryKeys.overview(raceId),
    queryFn: ({ signal }) => getSecretMissionOverview(raceId!, signal),
    select: (data) => data.map(mapOverviewDtoToFrontendModel),
    enabled: Boolean(raceId),
  })