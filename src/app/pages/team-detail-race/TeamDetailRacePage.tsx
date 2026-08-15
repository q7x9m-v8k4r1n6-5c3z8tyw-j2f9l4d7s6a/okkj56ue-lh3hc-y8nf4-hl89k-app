import { TeamLeaderboardView } from '@/core/features/team/leaderboard'
import { TeamMapView } from '@/core/features/team/map'
import { TeamRaceMenuView } from '@/core/features/team/race-menu' 
import { TeamRaceMoreMenu } from './components/TeamRaceMoreMenu'
import { TeamRaceRulesView } from '@/core/features/team/race-rules'
import { TeamQrScanView } from '@/core/features/team/scan-qr'
import { TeamRaceUnavailableView } from '@/core/features/team/team-race'
import { TeamRouteLayout } from '@/core/widgets/team-layout'
import { useTeamDetailRacePage } from './model/useTeamDetailRacePage'

export const TeamDetailRacePage = () => {
  const page = useTeamDetailRacePage()
  
  const canShowRaceTabs = !page.isRaceAccessLoading
    && !page.isRaceAccessError
    && !page.isRaceUnavailable

  return (
    <TeamRouteLayout
      activeNavId={page.activeTab}
      isMenuOpen={page.isMenuOpen}
      navItems={page.isMenuOpen || !canShowRaceTabs ? [] : page.navItems}
      onHeaderMenuToggle={page.toggleMenu}
      onNavChange={page.onNavChange}
      raceName={page.raceName}
    >
      {page.isMenuOpen ? (
        <TeamRaceMenuView
          onCancel={page.toggleMenu}
          onReturnToRaceList={page.returnToRaceList}
        />
      ) : (
        <>
          {page.isRaceAccessLoading ? (
            <section className="flex min-h-full items-center justify-center px-5 py-12 text-center text-sm text-[#737373]">
              Đang tải thông tin trận đấu...
            </section>
          ) : null}

          {page.isRaceAccessError ? (
            <TeamRaceUnavailableView
              message={page.errorMessage}
              onReturnToRaceList={page.returnToRaceList}
            />
          ) : null}

          {page.isRaceUnavailable ? (
            <TeamRaceUnavailableView
              message={page.unavailableMessage}
              onReturnToRaceList={page.returnToRaceList}
            />
          ) : null}

          {canShowRaceTabs && page.activeTab === 'rules' ? <TeamRaceRulesView /> : null}
          {canShowRaceTabs && page.activeTab === 'map' ? <TeamMapView /> : null}
          {canShowRaceTabs && page.activeTab === 'scan' ? <TeamQrScanView /> : null}
          {canShowRaceTabs && page.activeTab === 'leaderboard' ? <TeamLeaderboardView /> : null}
          {canShowRaceTabs && page.activeTab === 'more' ? <TeamRaceMoreMenu /> : null}
        </>
      )}
    </TeamRouteLayout>
  )
}