import { createElement, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTeamRaceAccess } from '@/core/features/team/team-race'
import { GavelIcon, GridMenuIcon, LeaderboardIcon, MapIcon, QrScanIcon } from '@/core/assets'
import type { TeamNavItem } from '@/core/shared'

const navItems: TeamNavItem[] = [
  { id: 'rules', label: 'Luật chơi', icon: createElement(GavelIcon) },
  { id: 'map', label: 'Bản đồ', icon: createElement(MapIcon) },
  { id: 'scan', label: 'Quét QR', icon: createElement(QrScanIcon) },
  { id: 'leaderboard', label: 'BXH', icon: createElement(LeaderboardIcon) },
  { id: 'more', label: 'Khác', icon: createElement(GridMenuIcon) },
]

/**
 * Owns presentation-only menu and layout state for the team card-description route.
 */
export const useTeamCardDescriptionPage = () => {
  const navigate = useNavigate()
  const { raceId } = useParams<{ raceId: string }>()
  const raceAccess = useTeamRaceAccess(raceId)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return {
    raceName: raceAccess.raceName,
    isMenuOpen,
    isRaceAccessLoading: raceAccess.isLoading,
    isRaceAccessError: raceAccess.isError,
    isRaceUnavailable: raceAccess.isUnavailable,
    errorMessage: raceAccess.errorMessage,
    unavailableMessage: raceAccess.unavailableMessage,
    navItems,
    toggleMenu: () => setIsMenuOpen((prev) => !prev),
    onNavChange: (value: string) => {
      navigate(`/team/races/${raceId}?tab=${value}`)
    },
    returnToRaceList: () => navigate('/team'),
  }
}