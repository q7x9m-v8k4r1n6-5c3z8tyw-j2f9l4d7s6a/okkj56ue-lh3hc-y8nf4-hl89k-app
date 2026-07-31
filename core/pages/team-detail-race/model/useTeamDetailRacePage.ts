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

/**
 * Owns presentation-only tab and menu state for the team race-detail route.
 */
export const useTeamDetailRacePage = () => {
  const navigate = useNavigate()
  const { raceId } = useParams<{ raceId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const raceAccess = useTeamRaceAccess(raceId)
  const initialTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<TeamDetailRaceTab>(
    initialTab && isTeamDetailRaceTab(initialTab) && initialTab !== 'more' ? initialTab : 'rules',
  )
  const [previousTab, setPreviousTab] = useState<TeamPrimaryDetailRaceTab>('rules')
  const isMenuOpen = activeTab === 'more'

  const openMenu = () => {
    if (isTeamPrimaryDetailRaceTab(activeTab)) setPreviousTab(activeTab)
    setActiveTab('more')
  }

  return {
    activeTab,
    closeMenu: () => setActiveTab(previousTab),
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
      setPreviousTab(value)
      setActiveTab(value)
      setSearchParams((current) => { current.set('tab', value); return current })
    },
    openMenu,
    raceName: raceAccess.raceName,
    returnToRaceList: () => navigate('/team'),
    unavailableMessage: raceAccess.unavailableMessage,
  }
}
