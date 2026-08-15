import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useTeamRaceAccess } from '@/core/features/team/team-race'
import {
  isTeamDetailRaceTab,
  teamDetailRaceNavItems,
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
  const initialTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<TeamDetailRaceTab>(
    initialTab && isTeamDetailRaceTab(initialTab) ? initialTab : 'rules'
  )

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return {
    activeTab,
    errorMessage: raceAccess.errorMessage,
    isMenuOpen,
    isRaceAccessError: raceAccess.isError,
    isRaceAccessLoading: raceAccess.isLoading,
    isRaceUnavailable: raceAccess.isUnavailable,
    navItems: teamDetailRaceNavItems,
    
    onNavChange: (value: string) => {
      if (!isTeamDetailRaceTab(value)) return
      setActiveTab(value)
      setSearchParams((current) => { current.set('tab', value); return current })
    },
    
    toggleMenu: () => setIsMenuOpen((prev) => !prev),
    raceName: raceAccess.raceName,
    returnToRaceList: () => navigate('/team'),
    unavailableMessage: raceAccess.unavailableMessage,
  }
}