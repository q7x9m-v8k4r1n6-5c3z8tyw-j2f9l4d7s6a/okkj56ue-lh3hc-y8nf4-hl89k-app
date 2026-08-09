import { useState } from 'react'

/**
 * Owns presentation-only menu state for the team race-list route.
 */
export const useTeamRaceListPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return {
    closeMenu: () => setIsMenuOpen(false),
    isMenuOpen,
    openMenu: () => setIsMenuOpen(true),
  }
}
