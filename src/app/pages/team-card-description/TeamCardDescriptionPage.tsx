import { TeamCardDetailView } from '@/plugin/move2026/features/card'
import { TeamRaceMenuView } from '@/core/features/team/race-menu'
import { TeamRaceUnavailableView } from '@/core/features/team/team-race'
import { TeamRouteLayout } from '@/core/widgets/team-layout'
import { useTeamCardDescriptionPage } from './model/useTeamCardDescriptionPage'

/**
 * Entry page hiển thị chi tiết và hành động sử dụng của một card.
 */
export const TeamCardDescriptionPage = () => {
  const page = useTeamCardDescriptionPage()

  const canShowContent = !page.isRaceAccessLoading 
    && !page.isRaceAccessError 
    && !page.isRaceUnavailable

  return (
    <TeamRouteLayout
      activeNavId="more"
      isMenuOpen={page.isMenuOpen}
      navItems={page.isMenuOpen || !canShowContent ? [] : page.navItems}
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

          {page.isRaceAccessError || page.isRaceUnavailable ? (
            <TeamRaceUnavailableView
              message={page.errorMessage || page.unavailableMessage}
              onReturnToRaceList={page.returnToRaceList}
            />
          ) : null}

          {canShowContent ? <TeamCardDetailView /> : null}
        </>
      )}
    </TeamRouteLayout>
  )
}
