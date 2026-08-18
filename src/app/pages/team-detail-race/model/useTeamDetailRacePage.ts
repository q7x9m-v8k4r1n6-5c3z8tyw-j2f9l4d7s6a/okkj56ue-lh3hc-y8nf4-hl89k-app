import { useEffect, useState } from 'react'
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
  const initialTab = searchParams.get(TEAM_RACE_TAB_PARAM)
  const [activeTab, setActiveTab] = useState<TeamDetailRaceTab>(
    initialTab && isTeamDetailRaceTab(initialTab) ? initialTab : 'rules'
  )
  const [previousTab, setPreviousTab] = useState<TeamPrimaryRaceTab>(
    isTeamDetailRaceTab(initialTab ?? '') && isTeamPrimaryRaceTab(initialTab as TeamDetailRaceTab)
      ? initialTab as TeamPrimaryRaceTab
      : 'rules',
  )

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const requestedTab = searchParams.get(TEAM_RACE_TAB_PARAM)
    if (!requestedTab || !isTeamDetailRaceTab(requestedTab)) return
    setActiveTab(requestedTab)
    setIsMenuOpen(requestedTab === TEAM_RACE_MENU_TAB)
  }, [searchParams])

  const setTab = (tab: TeamDetailRaceTab) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      next.set(TEAM_RACE_TAB_PARAM, tab)
      return next
    })
    setActiveTab(tab)
  }

  const openMenu = () => {
    if (isTeamPrimaryRaceTab(activeTab)) setPreviousTab(activeTab)
    setTab(TEAM_RACE_MENU_TAB)
    setIsMenuOpen(true)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
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
      setIsMenuOpen(false)
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
