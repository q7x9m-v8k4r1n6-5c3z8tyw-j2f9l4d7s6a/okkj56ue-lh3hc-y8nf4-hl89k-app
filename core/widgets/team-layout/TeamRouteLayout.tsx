import type { PropsWithChildren } from 'react'
import { TeamBoothNotificationListener } from '@/core/features/team/scan-qr'
import { TeamLayout, type TeamNavItem } from '@/core/shared'
import { useTeamRouteLayout } from './useTeamRouteLayout'

export type TeamRouteLayoutProps = PropsWithChildren<{
  activeNavId?: string
  isMenuOpen?: boolean
  navItems?: TeamNavItem[]
  onHeaderMenuToggle?: () => void
  onNavChange?: (navId: string) => void
  raceName: string
}>

/**
 * Connects authenticated team data to the presentation-only team layout.
 */
export const TeamRouteLayout = ({
  activeNavId,
  children,
  isMenuOpen,
  navItems,
  onHeaderMenuToggle,
  onNavChange,
  raceName,
}: TeamRouteLayoutProps) => {
  const layout = useTeamRouteLayout()

  return (
    <>
      <TeamBoothNotificationListener />
      <TeamLayout
        activeNavId={activeNavId}
        isMenuOpen={isMenuOpen}
        navItems={navItems}
        onHeaderMenuToggle={onHeaderMenuToggle}
        onNavChange={onNavChange}
        raceName={raceName}
        teamName={layout.teamName}
      >
        {children}
      </TeamLayout>
    </>
  )
}
