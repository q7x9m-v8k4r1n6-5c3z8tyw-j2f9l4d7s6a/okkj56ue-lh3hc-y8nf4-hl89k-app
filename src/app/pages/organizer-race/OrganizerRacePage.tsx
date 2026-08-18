import { OrganizerAnnouncementHistoryView } from '@/core/features/organizer/announcement-history'
import { OrganizerHistoryView } from '@/core/features/organizer/history'
import { OrganizerJoinRequestsView } from '@/core/features/organizer/join-requests'
import { OrganizerMenuView } from '@/core/features/organizer/menu'
import { OrganizerRaceUnavailableView } from '@/core/features/organizer/organizer-race'
import { OrganizerRaceRulesView } from '@/core/features/organizer/race-rules'
import { RaceMessageNotificationBanner } from '@/core/features/race/race-message-notification'
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
  const canShowBottomNav = canShowRaceTabs
    && page.activeTab !== 'menu'
    && page.activeTab !== 'announcement-history'

  return (
    <OrganizerRouteLayout
      activeNavId={page.activeTab}
      isMenuOpen={page.isMenuOpen}
      navItems={canShowBottomNav ? page.navItems : []}
      onHeaderMenuToggle={page.openMenu}
      onNavChange={page.onNavChange}
      raceName={page.raceName}
    >
      {page.activeTab === 'menu' ? (
        <OrganizerMenuView
          onCancel={page.closeMenu}
          onOpenAnnouncementHistory={page.openAnnouncementHistory}
          onReturnToRaceList={page.returnToRaceList}
        />
      ) : null}
      {canShowRaceTabs && page.activeTab !== 'menu' ? (
        <RaceMessageNotificationBanner />
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
      {canShowRaceTabs && page.activeTab === 'announcement-history' ? (
        <OrganizerAnnouncementHistoryView />
      ) : null}
    </OrganizerRouteLayout>
  )
}
