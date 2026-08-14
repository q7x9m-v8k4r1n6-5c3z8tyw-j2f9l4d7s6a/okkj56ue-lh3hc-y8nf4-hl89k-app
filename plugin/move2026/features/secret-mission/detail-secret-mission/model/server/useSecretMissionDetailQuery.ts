import { useQuery } from '@tanstack/react-query'
import { getSecretMissionDetail } from '../../api/detailSecretMission.api'
import {secretMissionDetailQueryKeys} from './secretMissionDetail.queryKeys'

export const useSecretMissionDetailQuery = (missionId?: string) =>
  useQuery({
    queryKey: secretMissionDetailQueryKeys.detail(missionId),
    queryFn: ({ signal }) => getSecretMissionDetail(missionId!, signal),
    enabled: Boolean(missionId), 
  })