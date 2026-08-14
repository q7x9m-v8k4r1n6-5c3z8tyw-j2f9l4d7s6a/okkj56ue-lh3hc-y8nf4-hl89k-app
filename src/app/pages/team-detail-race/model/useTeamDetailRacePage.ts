import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTeamRaceAccess } from '@/core/features/team/team-race'
import {
  isTeamDetailRaceTab,
  isTeamPrimaryDetailRaceTab,
  teamDetailRaceNavItems,
  type TeamDetailRaceTab,
  type TeamPrimaryDetailRaceTab,
} from './teamDetailRace.tabs'

const TEAM_RACE_TAB_PARAM = 'tab'
const DEFAULT_TAB: TeamPrimaryDetailRaceTab = 'rules'

/**
 * Owns presentation-only tab and header menu state for the team race-detail route.
 */
export const useTeamDetailRacePage = () => {
  const navigate = useNavigate()
  const { raceId } = useParams<{ raceId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const raceAccess = useTeamRaceAccess(raceId)

  const tabParam = searchParams.get(TEAM_RACE_TAB_PARAM)
  const activeTab: TeamDetailRaceTab = tabParam && isTeamDetailRaceTab(tabParam)
    ? tabParam
    : DEFAULT_TAB
  const [previousTab, setPreviousTab] = useState<TeamPrimaryDetailRaceTab>(
    isTeamPrimaryDetailRaceTab(activeTab) ? activeTab : DEFAULT_TAB,
  )
  const isMenuOpen = activeTab === 'more'

  const setTabSearchParam = (value: TeamDetailRaceTab) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set(TEAM_RACE_TAB_PARAM, value)
      return next
    })
  }

  const openMenu = () => {
    if (isTeamPrimaryDetailRaceTab(activeTab)) setPreviousTab(activeTab)
    setTabSearchParam('more')
  }

  return {
    activeTab,
    closeMenu: () => setTabSearchParam(previousTab),
    errorMessage: raceAccess.errorMessage,
    isMenuOpen,
    isRaceAccessError: raceAccess.isError,
    isRaceAccessLoading: raceAccess.isLoading,
    isRaceUnavailable: raceAccess.isUnavailable,
    navItems: teamDetailRaceNavItems,
    onNavChange: (value: string) => {
      if (!isTeamDetailRaceTab(value)) return
      if (value === 'more') {
        openMenu()
        return
      }
      if (!isTeamPrimaryDetailRaceTab(value)) return
      setPreviousTab(value)
      setTabSearchParam(value)
    },
    openAnnouncementHistory: () => setTabSearchParam('history'),
    openMenu,
    raceName: raceAccess.raceName,
    returnToRaceList: () => navigate('/team'),
    unavailableMessage: raceAccess.unavailableMessage,
  }
}
