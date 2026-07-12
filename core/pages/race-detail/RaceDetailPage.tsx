import { useNavigate, useParams } from 'react-router-dom'
import { useAdminRaceDetail } from '@/core/features'
import { ApiError, MoveButton, MovePanel, MoveProgressBar, MoveStatusBadge } from '@/core/shared'

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
})

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : dateFormatter.format(date)
}

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} phút`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (!remainingMinutes) return `${hours} giờ`
  return `${hours} giờ ${remainingMinutes} phút`
}

export const RaceDetailPage = () => {
  const navigate = useNavigate()
  const { raceId = '' } = useParams()
  const { data: row, isLoading, error } = useAdminRaceDetail(raceId, { enabled: Boolean(raceId), refetchInterval: 15000 })

  if (isLoading) {
    return (
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
        <section className="mx-auto max-w-[1140px]">
          <MovePanel className="px-5 py-8 text-sm text-[#8b8580]">Đang tải thống kê trận đấu...</MovePanel>
        </section>
      </main>
    )
  }

  if (!row) {
    const isNotFound = error instanceof ApiError && error.statusCode === 404

    return (
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
        <section className="mx-auto max-w-[1140px]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[2rem] font-semibold tracking-tight text-[#1f1f22]">
                {isNotFound ? 'Không tìm thấy trận đấu' : 'Không thể tải dữ liệu'}
              </h1>
            </div>
            <MoveButton variant="secondary" size="md" onClick={() => navigate('/')}>Quay lại danh sách</MoveButton>
          </div>

          <MovePanel className="px-5 py-8 text-sm text-[#8b8580]">
            {isNotFound ? 'Trận đấu bạn chọn không còn tồn tại.' : 'Máy chủ hiện chưa trả về dữ liệu chi tiết trận đấu.'}
          </MovePanel>
        </section>
      </main>
    )
  }

  return (
    <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
      <section className="mx-auto max-w-[1140px] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[2rem] font-semibold tracking-tight text-[#1f1f22]">{row.name}</h1>
            <p className="mt-1 text-sm text-[#8b8580]">
              Trang quản trị chi tiết dành cho Admin để theo dõi tiến độ tổng thể của trận đấu theo thời gian thực.
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#b1aaa5]">
              Snapshot hệ thống: {formatDateTime(row.statistics.generatedAt)}
            </p>
          </div>
          <MoveButton variant="secondary" size="md" onClick={() => navigate('/')}>Quay lại danh sách</MoveButton>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Tiến độ checkpoint" value={`${row.statistics.completionRate}%`} helper={`${row.statistics.completedCheckpoints}/${row.statistics.totalStations} checkpoint`} />
          <StatCard label="Đội đang tham gia" value={String(row.statistics.totalTeams)} helper={`${row.statistics.teamsInProgress} đang chạy`} />
          <StatCard label="Trạm hoạt động" value={String(row.statistics.activeStations)} helper={`${row.statistics.pendingCheckpoints} checkpoint chờ`} />
          <StatCard label="Cập nhật dữ liệu" value={formatDate(row.lastUpdatedAt)} helper={timeFormatter.format(new Date(row.lastUpdatedAt))} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <MovePanel className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#a39b96]">Thông tin cơ bản</p>
                <h2 className="mt-2 text-[1.5rem] font-semibold tracking-tight text-[#1f1f22]">{row.name}</h2>
              </div>
              <MoveStatusBadge status={row.status} label={row.status === 'live' ? 'In Progress' : row.status === 'done' ? 'Completed' : 'Upcoming'} />
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <InfoTile label="Địa điểm" value={row.location || 'Chưa cập nhật'} />
              <InfoTile label="Ngày diễn ra" value={formatDate(row.startAt)} />
              <InfoTile label="Khung giờ" value={`${timeFormatter.format(new Date(row.startAt))} - ${timeFormatter.format(new Date(row.endAt))}`} />
              <InfoTile label="Thời lượng" value={formatDuration(row.durationMinutes)} />
              <InfoTile label="Đội tham gia" value={String(row.participantCount)} />
              <InfoTile label="Lần cập nhật cuối" value={formatDateTime(row.lastUpdatedAt)} />
            </dl>
          </MovePanel>

          <MovePanel className="p-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#a39b96]">Thống kê thời gian thực</p>
            <div className="mt-5">
              <div className="flex items-end justify-between">
                <span className="text-[2.3rem] font-semibold text-[#1f1f22]">{row.statistics.completionRate}%</span>
                <span className="text-sm text-[#8b8580]">{row.statistics.completedCheckpoints} / {row.statistics.totalStations} checkpoint</span>
              </div>
              <MoveProgressBar className="mt-4" size="lg" value={row.statistics.completionRate} />
              <div className="mt-5 space-y-2">
                <MetricRow label="Đội đã hoàn tất" value={row.statistics.teamsCompleted} />
                <MetricRow label="Đội đang di chuyển" value={row.statistics.teamsInProgress} />
                <MetricRow label="Đội đang chờ" value={row.statistics.teamsWaiting} />
                <MetricRow label="Checkpoint còn lại" value={row.statistics.pendingCheckpoints} />
              </div>
            </div>
          </MovePanel>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <MovePanel className="p-5">
            <h3 className="text-sm font-semibold text-[#2f2b2a]">Thông tin trạm</h3>
            <div className="mt-4 max-h-96 space-y-3 overflow-auto">
              {row.stations.map((station, index) => (
                <article className="rounded-xl border border-[#f0eae7] bg-[#fcfbfa] p-4" key={`${station.name}-${index}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-sm font-semibold text-[#2f2b2a]">{station.name}</h4>
                    <span className="rounded-full bg-[#fff1f2] px-2.5 py-1 text-[0.68rem] font-semibold text-[#dc2626]">{station.points} điểm</span>
                  </div>
                  <p className="mt-2 text-sm text-[#6d6662]">{station.location}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-[0.12em] text-[#9b948f]">Quản trạm: {station.manager}</p>
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8b8580]">{station.status}</span>
                  </div>
                </article>
              ))}
            </div>
          </MovePanel>

          <MovePanel className="p-5">
            <h3 className="text-sm font-semibold text-[#2f2b2a]">Đội chơi / BTC liên quan</h3>
            <div className="mt-4 max-h-96 space-y-3 overflow-auto">
              {row.teams.map((team, index) => (
                <article className="rounded-xl border border-[#f0eae7] bg-[#fcfbfa] p-4" key={`team-${team.name}-${index}`}>
                  <p className="text-sm font-semibold text-[#2f2b2a]">{team.name}</p>
                  <p className="mt-2 text-sm text-[#6d6662]">{team.mission}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#9b948f]">Đội chơi</p>
                </article>
              ))}
              {row.organizers.map((organizer, index) => (
                <article className="rounded-xl border border-[#f0eae7] bg-[#fcfbfa] p-4" key={`organizer-${organizer.name}-${index}`}>
                  <p className="text-sm font-semibold text-[#2f2b2a]">{organizer.name}</p>
                  <p className="mt-2 text-sm text-[#6d6662]">{organizer.mission}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#9b948f]">Ban tổ chức</p>
                </article>
              ))}
            </div>
          </MovePanel>
        </div>

        <MovePanel className="p-5">
          <h3 className="text-sm font-semibold text-[#2f2b2a]">Cài đặt áp dụng cho trận đấu</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {row.settingsRows.map((setting, index) => (
              <article className="rounded-xl border border-[#f0eae7] bg-[#fcfbfa] p-4" key={`setting-${setting.name}-${index}`}>
                <p className="text-sm font-semibold text-[#2f2b2a]">{setting.name}</p>
                <p className="mt-2 text-sm text-[#6d6662]">{setting.mission}</p>
              </article>
            ))}
          </div>
        </MovePanel>
      </section>
    </main>
  )
}

const StatCard = ({ helper, label, value }: { label: string; value: string; helper: string }) => (
  <div className="rounded-[1.25rem] border border-[#efe8e5] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#8b8580]">{label}</p>
    <p className="mt-3 text-[1.8rem] font-semibold tracking-tight text-[#1f1f22]">{value}</p>
    <p className="mt-2 text-sm text-[#8b8580]">{helper}</p>
  </div>
)

const InfoTile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-[#f0eae7] bg-[#fcfbfa] p-4">
    <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#9b948f]">{label}</dt>
    <dd className="mt-2 text-sm font-medium text-[#3d3937]">{value}</dd>
  </div>
)

const MetricRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between rounded-xl border border-[#f0eae7] bg-[#fcfbfa] px-4 py-3 text-sm text-[#6d6662]">
    <span>{label}</span>
    <span className="font-semibold text-[#2f2b2a]">{value}</span>
  </div>
)
