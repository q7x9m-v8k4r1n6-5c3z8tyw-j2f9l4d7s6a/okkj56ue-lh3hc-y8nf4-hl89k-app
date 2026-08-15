import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'
import {
  isTeamAnnouncementTargetedToUser,
  mapTeamAnnouncementHistoryItem,
} from '../../model/teamAnnouncementHistory.presentation'
import { useTeamAnnouncementHistoryQuery } from '../../model/server/useTeamAnnouncementHistoryQuery'

export const useTeamAnnouncementHistory = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const auth = useAuthSession()
  const query = useTeamAnnouncementHistoryQuery(raceId)

  const items = useMemo(() => (
    query.data
      ?.filter((message) => isTeamAnnouncementTargetedToUser(message, auth.user?.id))
      .map(mapTeamAnnouncementHistoryItem) ?? []
  ), [auth.user?.id, query.data])

  return {
    isError: query.isError,
    isLoading: query.isLoading,
    items,
    retry: query.refetch,
  }
}
