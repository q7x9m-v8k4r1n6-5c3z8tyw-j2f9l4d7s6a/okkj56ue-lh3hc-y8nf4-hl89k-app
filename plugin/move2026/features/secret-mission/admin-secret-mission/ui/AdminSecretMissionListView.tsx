import { useParams } from 'react-router-dom'
import { EditIcon, TrashIcon } from '@/core/assets'
import { Button, IconButton } from '@/core/shared'
import { formatSecretMissionName } from '@/plugin/move2026/features/secret-mission/shared/formatSecretMissionName'
import { useLeaderboardQuery } from '@/core/features/race/live-race/model/server/useLiveQueries'
import type { TeamLeaderboardItem } from '@/core/features/race/live-race/model/liveRace.schemas'
import { useAdminSecretMissionListView } from './hooks/useAdminSecretMissionListView'
import { SecretMissionFormDrawer } from './components/SecretMissionFormDrawer'
import { AdminSecretMissionDetailView } from './AdminSecretMissionDetailView'

export const AdminSecretMissionListView = () => {
  const { raceId } = useParams<{ raceId: string }>()
  const leaderboardQuery = useLeaderboardQuery(raceId)
  const view = useAdminSecretMissionListView(raceId)

  if (!raceId) return null

  const teams = (leaderboardQuery.data ?? []).map((team: TeamLeaderboardItem) => ({
    id: team.teamId,
    name: team.displayName,
  }))

  if (view.selectedMissionId) {
    return (
      <AdminSecretMissionDetailView
        missionId={view.selectedMissionId}
        onBack={view.closeDetail}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold uppercase tracking-tight text-[#1a1c1c]">
          Danh sách nhiệm vụ bí mật
        </h2>
        <Button onClick={view.openCreateDrawer}>Tạo nhiệm vụ bí mật</Button>
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-[#e5e5e5] bg-white shadow-sm">
        <div className="w-full min-w-0">
          <div className="sticky top-0 z-10 hidden grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)_120px_80px] gap-4 border-b border-[#eeeeee] bg-[#fbfbfb] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#737373] md:grid">
            <span>Tên nhiệm vụ</span>
            <span>Mô tả nhiệm vụ</span>
            <span>Đội thực hiện</span>
            <span>Trạng thái</span>
            <span />
          </div>

          {view.isLoading ? (
            <div className="px-5 py-10 text-center text-sm text-gray-500">Đang tải...</div>
          ) : view.isError ? (
            <div className="px-5 py-10 text-center text-sm text-red-500">
              Không thể tải danh sách nhiệm vụ.
            </div>
          ) : view.missions.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm italic text-gray-400">
              Chưa có nhiệm vụ bí mật nào.
            </div>
          ) : (
            view.missions.map((mission) => {
              const isSubmitted = mission.hasImageEvidence || mission.hasVideoEvidence

              return (
                <div
                  key={mission.id}
                  className="grid min-w-0 grid-cols-1 items-center gap-3 border-b border-[#f2f2f2] px-5 py-3 text-sm text-[#525252] transition-colors last:border-none hover:bg-[#fcfcfc] md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)_120px_80px] md:gap-4"
                >
                  <button
                    type="button"
                    className="min-w-0 truncate text-left font-medium text-[#171717] hover:underline"
                    onClick={() => view.openDetail(mission.id)}
                  >
                    {formatSecretMissionName(mission.name, mission.isAssigned)}
                  </button>

                  <span className="min-w-0 truncate text-[#737373]">
                    {mission.description || '—'}
                  </span>

                  <span className="min-w-0 truncate text-[#737373]">
                    {mission.teamName ?? 'Chưa gán team'}
                  </span>

                  <span
                    className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      isSubmitted
                        ? 'bg-[#dcfce7] text-[#166534]'
                        : 'bg-[#f3f4f6] text-[#6b7280]'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSubmitted ? 'bg-[#166534]' : 'bg-[#9ca3af]'
                      }`}
                    />
                    {isSubmitted ? 'Đã nộp' : 'Chưa nộp'}
                  </span>

                  <div className="flex items-center justify-end gap-1 text-[#525252]">
                    <IconButton
                      aria-label={`Chỉnh sửa ${mission.name}`}
                      className="rounded-lg p-[10px]"
                      icon={<EditIcon className="size-5" />}
                      onClick={() => view.openEditDrawer(mission)}
                    />
                    <IconButton
                      aria-label={`Xóa ${mission.name}`}
                      className="rounded-lg p-[10px]"
                      icon={<TrashIcon className="size-5" />}
                      onClick={() => view.handleDelete(mission.id)}
                    />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <SecretMissionFormDrawer
        open={view.isDrawerOpen}
        editingMission={view.editingMission}
        teams={teams}
        onSubmit={view.handleSubmit}
        onClose={view.closeDrawer}
        isSubmitting={view.isSubmitting}
        errorMessage={view.submitErrorMessage}
      />
    </div>
  )
}