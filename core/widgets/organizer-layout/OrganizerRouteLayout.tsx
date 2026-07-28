import type { PropsWithChildren } from 'react'
import { OrganizerLayout, type OrganizerNavItem } from '@/core/shared'
import { useOrganizerRouteLayout } from './useOrganizerRouteLayout'

export type OrganizerRouteLayoutProps = PropsWithChildren<{
  activeNavId?: string
  isMenuOpen?: boolean
  navItems?: OrganizerNavItem[]
  onHeaderMenuToggle?: () => void
  onNavChange?: (navId: string) => void
  raceName: string
}>

/**
 * Connects authenticated organizer data to the presentation-only layout.
 */
export const OrganizerRouteLayout = ({
  activeNavId,
  children,
  isMenuOpen,
  navItems,
  onHeaderMenuToggle,
  onNavChange,
  raceName,
}: OrganizerRouteLayoutProps) => {
  const layout = useOrganizerRouteLayout()

  return (
    <OrganizerLayout
      activeNavId={activeNavId}
      isMenuOpen={isMenuOpen}
      navItems={navItems}
      onHeaderMenuToggle={onHeaderMenuToggle}
      onNavChange={onNavChange}
      raceName={raceName}
      stationName={layout.stationName}
    >
      {children}
    </OrganizerLayout>
  )
}
