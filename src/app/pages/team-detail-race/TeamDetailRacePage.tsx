import { RaceMessageNotificationBanner } from '@/core/features/race/race-message-notification'
import { TeamAnnouncementHistoryView } from '@/core/features/team/announcement-history'
import { TeamLeaderboardView } from '@/core/features/team/leaderboard'
import { TeamMapView } from '@/core/features/team/map'
import { TeamRaceMenuView } from '@/core/features/team/race-menu'
import { TeamRaceRulesView } from '@/core/features/team/race-rules'
import { TeamQrScanView } from '@/core/features/team/scan-qr'
import { TeamRaceUnavailableView } from '@/core/features/team/team-race'
import { TeamRouteLayout } from '@/core/widgets/team-layout'
import { useTeamDetailRacePage } from './model/useTeamDetailRacePage'

/**
 * Composes team race-detail feature tabs while each feature owns its workflow.
 */
export const TeamDetailRacePage = () => {
  const page = useTeamDetailRacePage()
  const canShowRaceTabs = !page.isRaceAccessLoading
    && !page.isRaceAccessError
    && !page.isRaceUnavailable
  const canShowBottomNav = canShowRaceTabs
    && page.activeTab !== 'more'
    && page.activeTab !== 'history'

  return (
    <TeamRouteLayout
      activeNavId={page.activeTab}
      isMenuOpen={page.isMenuOpen}
      navItems={canShowBottomNav ? page.navItems : []}
      onHeaderMenuToggle={page.openMenu}
      onNavChange={page.onNavChange}
      raceName={page.raceName}
    >
      {page.activeTab === 'more' ? (
        <TeamRaceMenuView
          onCancel={page.closeMenu}
          onOpenAnnouncementHistory={page.openAnnouncementHistory}
          onReturnToRaceList={page.returnToRaceList}
        />
      ) : null}
      {canShowRaceTabs && page.activeTab !== 'more' ? (
        <RaceMessageNotificationBanner />
      ) : null}
      {page.activeTab !== 'more' && page.isRaceAccessLoading ? (
        <section className="flex min-h-full items-center justify-center px-5 py-12 text-center text-sm text-[#737373]">
          Đang tải thông tin trận đấu...
        </section>
      ) : null}
      {page.activeTab !== 'more' && page.isRaceAccessError ? (
        <TeamRaceUnavailableView
          message={page.errorMessage}
          onReturnToRaceList={page.returnToRaceList}
        />
      ) : null}
      {page.activeTab !== 'more' && page.isRaceUnavailable ? (
        <TeamRaceUnavailableView
          message={page.unavailableMessage}
          onReturnToRaceList={page.returnToRaceList}
        />
      ) : null}
      {canShowRaceTabs && page.activeTab === 'rules' ? <TeamRaceRulesView /> : null}
      {canShowRaceTabs && page.activeTab === 'map' ? <TeamMapView /> : null}
      {canShowRaceTabs && page.activeTab === 'scan' ? <TeamQrScanView /> : null}
      {canShowRaceTabs && page.activeTab === 'leaderboard' ? <TeamLeaderboardView /> : null}
      {canShowRaceTabs && page.activeTab === 'history' ? (
        <TeamAnnouncementHistoryView onBack={page.openMenu} />
      ) : null}
    </TeamRouteLayout>
  )
}
