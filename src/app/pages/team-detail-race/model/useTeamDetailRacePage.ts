import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTeamRaceAccess } from '@/core/features/team/team-race'
import {
  TEAM_RACE_ANNOUNCEMENT_HISTORY_TAB,
  TEAM_RACE_MENU_TAB,
  TEAM_RACE_TAB_PARAM,
} from '@/core/shared/utils'
import {
  isTeamDetailRaceTab,
  isTeamPrimaryRaceTab,
  teamDetailRaceNavItems,
  type TeamPrimaryRaceTab,
  type TeamDetailRaceTab,
} from './teamDetailRace.tabs'

/**
 * Owns presentation-only tab and header menu state for the team race-detail route.
 */
export const useTeamDetailRacePage = () => {
  const navigate = useNavigate()
  const { raceId } = useParams<{ raceId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const raceAccess = useTeamRaceAccess(raceId)
  const requestedTab = searchParams.get(TEAM_RACE_TAB_PARAM)
  const activeTab: TeamDetailRaceTab =
    requestedTab && isTeamDetailRaceTab(requestedTab) ? requestedTab : 'rules'
  const [previousTab, setPreviousTab] = useState<TeamPrimaryRaceTab>(
    isTeamDetailRaceTab(requestedTab ?? '') && isTeamPrimaryRaceTab(requestedTab as TeamDetailRaceTab)
      ? requestedTab as TeamPrimaryRaceTab
      : 'rules',
  )

  const isMenuOpen = activeTab === TEAM_RACE_MENU_TAB

  const setTab = (tab: TeamDetailRaceTab) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set(TEAM_RACE_TAB_PARAM, tab)
      return next
    })
  }

  const openMenu = () => {
    if (isTeamPrimaryRaceTab(activeTab)) setPreviousTab(activeTab)
    setTab(TEAM_RACE_MENU_TAB)
  }

  const closeMenu = () => {
    setTab(previousTab)
  }

  return {
    activeTab,
    closeMenu,
    errorMessage: raceAccess.errorMessage,
    isMenuOpen,
    isRaceAccessError: raceAccess.isError,
    isRaceAccessLoading: raceAccess.isLoading,
    isRaceUnavailable: raceAccess.isUnavailable,
    navItems: teamDetailRaceNavItems,
    
    onNavChange: (value: string) => {
      if (!isTeamDetailRaceTab(value)) return
      if (!isTeamPrimaryRaceTab(value)) return
      setPreviousTab(value)
      setTab(value)
    },
    
    openAnnouncementHistory: () => {
      setTab(TEAM_RACE_ANNOUNCEMENT_HISTORY_TAB)
    },
    openMenu,
    toggleMenu: () => {
      if (isMenuOpen) {
        closeMenu()
        return
      }
      openMenu()
    },
    raceName: raceAccess.raceName,
    returnToRaceList: () => navigate('/team'),
    unavailableMessage: raceAccess.unavailableMessage,
  }
}
