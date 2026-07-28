import { OrganizerHistoryView } from '@/core/features/organizer/history'
import { OrganizerJoinRequestsView } from '@/core/features/organizer/join-requests'
import { OrganizerMenuView } from '@/core/features/organizer/menu'
import { OrganizerRaceUnavailableView } from '@/core/features/organizer/organizer-race'
import { OrganizerRaceRulesView } from '@/core/features/organizer/race-rules'
import { OrganizerRouteLayout } from '@/core/widgets/organizer-layout'
import { useOrganizerRacePage } from './model/useOrganizerRacePage'

/**
 * Composes organizer station features into the organizer route shell.
 */
export const OrganizerRacePage = () => {
  const page = useOrganizerRacePage()
  const canShowRaceTabs = !page.isRaceAccessLoading
    && !page.isRaceAccessError
    && !page.isRaceUnavailable

  return (
    <OrganizerRouteLayout
      activeNavId={page.activeTab}
      isMenuOpen={page.isMenuOpen}
      navItems={page.isMenuOpen || !canShowRaceTabs ? [] : page.navItems}
      onHeaderMenuToggle={page.openMenu}
      onNavChange={page.onNavChange}
      raceName={page.raceName}
    >
      {page.activeTab === 'menu' ? (
        <OrganizerMenuView
          onCancel={page.closeMenu}
          onReturnToRaceList={page.returnToRaceList}
        />
      ) : null}
      {page.activeTab !== 'menu' && page.isRaceAccessLoading ? (
        <section className="flex min-h-full items-center justify-center px-5 py-12 text-center text-sm text-[#737373]">
          Đang tải thông tin trận đấu...
        </section>
      ) : null}
      {page.activeTab !== 'menu' && page.isRaceAccessError ? (
        <OrganizerRaceUnavailableView
          message={page.errorMessage}
          onReturnToRaceList={page.returnToRaceList}
        />
      ) : null}
      {page.activeTab !== 'menu' && page.isRaceUnavailable ? (
        <OrganizerRaceUnavailableView
          message={page.unavailableMessage}
          onReturnToRaceList={page.returnToRaceList}
        />
      ) : null}
      {canShowRaceTabs && page.activeTab === 'rules' ? <OrganizerRaceRulesView /> : null}
      {canShowRaceTabs && page.activeTab === 'requests' ? <OrganizerJoinRequestsView /> : null}
      {canShowRaceTabs && page.activeTab === 'history' ? <OrganizerHistoryView /> : null}
    </OrganizerRouteLayout>
  )
}
