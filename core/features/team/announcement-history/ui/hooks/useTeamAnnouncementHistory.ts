import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useAuthSession } from '@/core/features/auth'
import {
  isTeamAnnouncementTargetedToUser,
  mapTeamAnnouncementHistoryItem,
} from '../../model/teamAnnouncementHistory.presentation'
import { useTeamAnnouncementHistoryQuery } from '../../model/server/useTeamAnnouncementHistoryQuery'

const TEAM_RACE_TAB_PARAM = 'tab'
const TEAM_RACE_MENU_TAB = 'menu'

export const useTeamAnnouncementHistory = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const [, setSearchParams] = useSearchParams()
  const auth = useAuthSession()
  const query = useTeamAnnouncementHistoryQuery(raceId)

  const items = useMemo(() => (
    query.data
      ?.filter((message) => isTeamAnnouncementTargetedToUser(message, auth.user?.id))
      .map(mapTeamAnnouncementHistoryItem) ?? []
  ), [auth.user?.id, query.data])

  return {
    backToMenu: () => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current)
        next.set(TEAM_RACE_TAB_PARAM, TEAM_RACE_MENU_TAB)
        return next
      })
    },
    isError: query.isError,
    isLoading: query.isLoading,
    items,
    retry: query.refetch,
  }
}
