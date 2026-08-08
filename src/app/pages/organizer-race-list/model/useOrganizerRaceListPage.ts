import { useState } from 'react'

/**
 * Owns presentation-only menu state for the organizer race-list route.
 */
export const useOrganizerRaceListPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return {
    closeMenu: () => setIsMenuOpen(false),
    isMenuOpen,
    openMenu: () => setIsMenuOpen(true),
  }
}
