import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'
import {
  isOrganizerAnnouncementTargetedToUser,
  mapOrganizerAnnouncementHistoryItem,
} from '../../model/organizerAnnouncementHistory.presentation'
import { useOrganizerAnnouncementHistoryQuery } from '../../model/server/useOrganizerAnnouncementHistoryQuery'

export const useOrganizerAnnouncementHistory = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const auth = useAuthSession()
  const query = useOrganizerAnnouncementHistoryQuery(raceId)

  const items = useMemo(() => (
    query.data
      ?.filter((message) => isOrganizerAnnouncementTargetedToUser(message, auth.user?.id))
      .map(mapOrganizerAnnouncementHistoryItem) ?? []
  ), [auth.user?.id, query.data])

  return {
    isError: query.isError,
    isLoading: query.isLoading,
    items,
    retry: query.refetch,
  }
}
