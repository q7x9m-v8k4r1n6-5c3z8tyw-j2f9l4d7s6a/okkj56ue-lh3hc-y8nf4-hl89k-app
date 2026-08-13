import { useParams, useSearchParams } from 'react-router-dom' // THÊM IMPORT NÀY
import { SecretMissionListView } from '@/plugin/move2026/features/secret-mission/list-secret-mission'
import { SecretMissionDetailContainer } from '@/plugin/move2026/features/secret-mission/detail-secret-mission' // THÊM CONTAINER
import { TeamRaceMenuView } from '@/core/features/team/race-menu'
import { TeamRaceUnavailableView } from '@/core/features/team/team-race'
import { TeamRouteLayout } from '@/core/widgets/team-layout'
import { useTeamSecretMissionListPage } from './model/useTeamSecretMissionListPage'

export const TeamSecretMissionListPage = () => {
  const page = useTeamSecretMissionListPage()
  
  // Đọc thông tin từ URL để phân luồng hiển thị
  const { missionId } = useParams<{ missionId: string }>()
  const [searchParams] = useSearchParams()
  const viewMode = searchParams.get('view')

  const canShowContent = !page.isRaceAccessLoading
    && !page.isRaceAccessError
    && !page.isRaceUnavailable

  // Xác định xem user có đang ở giao diện chi tiết không (view=info hoặc view=evidence)
  const isDetailViewActive = missionId && (viewMode === 'info' || viewMode === 'evidence' || viewMode === 'preview')
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

          {canShowContent ? (
            <>
              {/* CHỈ hiện List nếu không ở giao diện Detail */}
              {!isDetailViewActive ? <SecretMissionListView /> : null}
              
              {/* Container sẽ quản lý việc bung ModalOptionChoice (khi List đang hiện) HOẶC bung InfoView/EvidenceView thay thế List */}
              {missionId ? <SecretMissionDetailContainer /> : null}
            </>
          ) : null}
        </>
      )}
    </TeamRouteLayout>
  )
}