import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useOrganizerRaceAccess } from '@/core/features/organizer/organizer-race'
import { useMyBoothQuery } from '@/core/features/organizer/join-requests/model/server/useMyBoothQuery'
import {
  isOrganizerPrimaryRaceTab,
  isOrganizerRaceTab,
  organizerRaceNavItems,
  type OrganizerPrimaryRaceTab,
  type OrganizerRaceTab,
} from './organizerRace.tabs'

/**
 * Owns presentation-only tab and menu state for the organizer route.
 */
export const useOrganizerRacePage = () => {
  const navigate = useNavigate()
  const { raceId } = useParams<{ raceId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const raceAccess = useOrganizerRaceAccess(raceId)

  const myBoothQuery = useMyBoothQuery(raceId)

  const initialTab = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<OrganizerRaceTab>(
    initialTab && isOrganizerRaceTab(initialTab) && initialTab !== 'menu' ? initialTab : 'rules',
  )
  const [previousTab, setPreviousTab] = useState<OrganizerPrimaryRaceTab>('rules')
  const isMenuOpen = activeTab === 'menu'

  const openMenu = () => {
    if (isOrganizerPrimaryRaceTab(activeTab)) setPreviousTab(activeTab)
    setActiveTab('menu')
  }

  return {
    activeTab,
    boothId: myBoothQuery.data ?? undefined, 
    closeMenu: () => setActiveTab(previousTab),
    errorMessage: raceAccess.errorMessage,
    isMenuOpen,
    isRaceAccessError: raceAccess.isError,
    isRaceAccessLoading: raceAccess.isLoading,
    isRaceUnavailable: raceAccess.isUnavailable,
    navItems: organizerRaceNavItems,
    onNavChange: (value: string) => {
      if (!isOrganizerRaceTab(value)) return
      if (value === 'menu') {
        openMenu()
        return
      }
      setPreviousTab(value)
      setActiveTab(value)
      setSearchParams((current) => { current.set('tab', value); return current })
    },
    openMenu,
    raceName: raceAccess.raceName,
    returnToRaceList: () => navigate('/organizer'),
    unavailableMessage: raceAccess.unavailableMessage,
  }
}