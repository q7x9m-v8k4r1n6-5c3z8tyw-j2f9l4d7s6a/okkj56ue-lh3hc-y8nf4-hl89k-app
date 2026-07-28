import { OrganizerRaceCollection } from '@/core/features/organizer/list-race'
import { OrganizerMenuView } from '@/core/features/organizer/menu'
import { OrganizerRouteLayout } from '@/core/widgets/organizer-layout'
import { useOrganizerRaceListPage } from './model/useOrganizerRaceListPage'

/**
 * Composes the organizer race-list route and its route-level menu panel.
 */
export const OrganizerRaceListPage = () => {
  const page = useOrganizerRaceListPage()

  return (
    <OrganizerRouteLayout
      isMenuOpen={page.isMenuOpen}
      onHeaderMenuToggle={page.openMenu}
      raceName="MOVE 2025 - SEVALUX"
    >
      {page.isMenuOpen ? (
        <OrganizerMenuView
          onCancel={page.closeMenu}
          onReturnToRaceList={page.closeMenu}
        />
      ) : (
        <OrganizerRaceCollection />
      )}
    </OrganizerRouteLayout>
  )
}
