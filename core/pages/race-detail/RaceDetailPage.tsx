import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, MovePanel, MoveProgressBar, MoveStatusBadge } from '@/core/shared'
import { getRaceProgress, getRaceRecord } from '@/core/shared/lib'

export const RaceDetailPage = () => {
  const navigate = useNavigate()
  const { raceId = '' } = useParams()
  const row = useMemo(() => getRaceRecord(raceId), [raceId])

  if (!row) {
    return (
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
        <section className="mx-auto max-w-[1140px]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[2rem] font-semibold tracking-tight text-[#1f1f22]">Không tìm thấy trận đấu</h1>
            </div>
            <Button variant="secondary" size="md" onClick={() => navigate('/')}>Quay lại danh sách</Button>
          </div>

          <MovePanel className="px-5 py-8 text-sm text-[#8b8580]">Không tìm thấy dữ liệu trận đấu.</MovePanel>
        </section>
      </main>
    )
  }

  const progress = getRaceProgress(row)

  return (
    <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
      <section className="mx-auto max-w-[1140px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[2rem] font-semibold tracking-tight text-[#1f1f22]">{row.name}</h1>
          </div>
          <Button variant="secondary" size="md" onClick={() => navigate('/')}>Quay lại danh sách</Button>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <MovePanel className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#a39b96]">Thông tin cơ bản</p>
                  <h2 className="mt-2 text-[1.5rem] font-semibold tracking-tight text-[#1f1f22]">{row.name}</h2>
                </div>
                <MoveStatusBadge status={row.status} label={row.status === 'live' ? 'In progress' : row.status === 'done' ? 'Completed' : 'Upcoming'} />
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#f0eae7] bg-[#fcfbfa] p-4">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#9b948f]">Địa điểm</dt>
                  <dd className="mt-2 text-sm font-medium text-[#3d3937]">{row.location || 'Chưa cập nhật'}</dd>
                </div>
                <div className="rounded-xl border border-[#f0eae7] bg-[#fcfbfa] p-4">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#9b948f]">Số thành viên</dt>
                  <dd className="mt-2 text-sm font-medium text-[#3d3937]">{row.members}</dd>
                </div>
                <div className="rounded-xl border border-[#f0eae7] bg-[#fcfbfa] p-4">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#9b948f]">Bắt đầu</dt>
                  <dd className="mt-2 text-sm font-medium text-[#3d3937]">{row.startText || row.startAt || 'Chưa cập nhật'}</dd>
                </div>
                <div className="rounded-xl border border-[#f0eae7] bg-[#fcfbfa] p-4">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#9b948f]">Kết thúc</dt>
                  <dd className="mt-2 text-sm font-medium text-[#3d3937]">{row.endText || row.endAt || 'Chưa cập nhật'}</dd>
                </div>
              </dl>
            </MovePanel>

            <MovePanel className="p-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#a39b96]">Tiến độ</p>
              <div className="mt-5">
                <div className="flex items-end justify-between">
                  <span className="text-[2.3rem] font-semibold text-[#1f1f22]">{progress.percent}%</span>
                  <span className="text-sm text-[#8b8580]">{progress.completed} / {progress.completed + progress.pending} checkpoint</span>
                </div>
                <MoveProgressBar className="mt-4" size="lg" value={progress.percent} />
                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between rounded-xl border border-[#f0eae7] bg-[#fcfbfa] px-4 py-3 text-sm text-[#6d6662]">
                    <span>Đã hoàn tất</span>
                    <span className="font-semibold text-[#2f2b2a]">{progress.completed}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-[#f0eae7] bg-[#fcfbfa] px-4 py-3 text-sm text-[#6d6662]">
                    <span>Đang chờ xử lý</span>
                    <span className="font-semibold text-[#2f2b2a]">{progress.pending}</span>
                  </div>
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
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#9b948f]">Quản trạm: {station.manager}</p>
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
        </div>
      </section>
    </main>
  )
}
