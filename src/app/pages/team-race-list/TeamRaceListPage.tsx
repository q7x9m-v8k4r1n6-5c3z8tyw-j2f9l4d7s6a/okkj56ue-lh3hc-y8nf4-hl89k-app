import { TeamRaceCollection } from '@/core/features/team/list-race'
import { TeamRaceMenuView } from '@/core/features/team/race-menu'
import { TeamRouteLayout } from '@/core/widgets/team-layout'
import { useTeamRaceListPage } from './model/useTeamRaceListPage'

/**
 * Composes the team race-list route and its route-level menu panel.
 */
export const TeamRaceListPage = () => {
  const page = useTeamRaceListPage()

  return (
    <TeamRouteLayout
      isMenuOpen={page.isMenuOpen}
      onHeaderMenuToggle={page.openMenu}
      raceName="MOVE 2025 - SEVALUX"
    >
      {page.isMenuOpen ? (
        <TeamRaceMenuView
          onCancel={page.closeMenu}
          onReturnToRaceList={page.closeMenu}
        />
      ) : (
        <TeamRaceCollection />
      )}
    </TeamRouteLayout>
  )
}
