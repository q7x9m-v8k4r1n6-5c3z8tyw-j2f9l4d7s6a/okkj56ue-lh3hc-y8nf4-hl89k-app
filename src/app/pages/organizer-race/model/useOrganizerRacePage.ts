import { useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useOrganizerRaceAccess } from '@/core/features/organizer/organizer-race'
import { ORGANIZER_RACE_TAB_PARAM } from '@/core/shared/utils/organizerRaceRoute'
import {
  isOrganizerPrimaryRaceTab,
  isOrganizerRaceTab,
  organizerRaceNavItems,
  type OrganizerPrimaryRaceTab,
  type OrganizerRaceTab,
} from './organizerRace.tabs'

const DEFAULT_TAB: OrganizerPrimaryRaceTab = 'rules'

/**
 * Owns presentation-only tab state for the organizer route, persisted in the
 * URL so features can read the active tab without page-passed props.
 */
export const useOrganizerRacePage = () => {
  const navigate = useNavigate()
  const { raceId } = useParams<{ raceId: string }>()
  const raceAccess = useOrganizerRaceAccess(raceId)
  const [searchParams, setSearchParams] = useSearchParams()

  const tabParam = searchParams.get(ORGANIZER_RACE_TAB_PARAM)
  const activeTab: OrganizerRaceTab = tabParam && isOrganizerRaceTab(tabParam) ? tabParam : DEFAULT_TAB
  const [previousTab, setPreviousTab] = useState<OrganizerPrimaryRaceTab>(
    isOrganizerPrimaryRaceTab(activeTab) ? activeTab : DEFAULT_TAB,
  )
  const isMenuOpen = activeTab === 'menu'

  const setTab = (tab: OrganizerRaceTab) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set(ORGANIZER_RACE_TAB_PARAM, tab)
      return next
    })
  }

  const openMenu = () => {
    if (isOrganizerPrimaryRaceTab(activeTab)) setPreviousTab(activeTab)
    setTab('menu')
  }

  return {
    activeTab,
    closeMenu: () => setTab(previousTab),
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
      if (!isOrganizerPrimaryRaceTab(value)) return
      setPreviousTab(value)
      setTab(value)
    },
    openAnnouncementHistory: () => setTab('announcement-history'),
    openMenu,
    raceName: raceAccess.raceName,
    returnToRaceList: () => navigate('/organizer'),
    unavailableMessage: raceAccess.unavailableMessage,
  }
}
