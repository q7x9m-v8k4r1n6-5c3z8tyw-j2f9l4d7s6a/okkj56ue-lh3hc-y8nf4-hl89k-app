import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'
import {
  ORGANIZER_RACE_MENU_TAB,
  ORGANIZER_RACE_TAB_PARAM,
} from '@/core/shared/utils'
import {
  isOrganizerAnnouncementTargetedToUser,
  mapOrganizerAnnouncementHistoryItem,
} from '../../model/organizerAnnouncementHistory.presentation'
import { useOrganizerAnnouncementHistoryQuery } from '../../model/server/useOrganizerAnnouncementHistoryQuery'

export const useOrganizerAnnouncementHistory = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const [, setSearchParams] = useSearchParams()
  const auth = useAuthSession()
  const query = useOrganizerAnnouncementHistoryQuery(raceId)

  const items = useMemo(() => (
    query.data
      ?.filter((message) => isOrganizerAnnouncementTargetedToUser(message, auth.user?.id))
      .map(mapOrganizerAnnouncementHistoryItem) ?? []
  ), [auth.user?.id, query.data])

  return {
    backToMenu: () => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current)
        next.set(ORGANIZER_RACE_TAB_PARAM, ORGANIZER_RACE_MENU_TAB)
        return next
      })
    },
    isError: query.isError,
    isLoading: query.isLoading,
    items,
    retry: query.refetch,
  }
}
