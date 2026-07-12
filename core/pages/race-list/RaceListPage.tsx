import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PlusIcon } from '@/core/assets'
import { useAdminRaceList } from '@/core/features'
import { MoveButton, MovePagination, MovePanel, MoveStatusBadge, useToast } from '@/core/shared'

type PageState = {
  toastMessage?: string
}

const PAGE_SIZE = 10

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

const formatTime = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : timeFormatter.format(date)
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} phút`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (!remainingMinutes) return `${hours} giờ`
  return `${hours} giờ ${remainingMinutes} phút`
}

export const RaceListPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useAdminRaceList()

  useEffect(() => {
    const state = location.state as PageState | null
    if (!state?.toastMessage) return

    toast({
      title: 'Thông báo',
      description: state.toastMessage,
    })

    navigate(location.pathname, { replace: true, state: {} })
  }, [location.pathname, location.state, navigate, toast])

  const rows = data?.items ?? []
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const visibleRows = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE
    return rows.slice(startIndex, startIndex + PAGE_SIZE)
  }, [rows, safePage])

  return (
    <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
      <section className="w-full space-y-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <SummaryCard label="Tổng trận đấu" value={String(data?.totalCount ?? 0)} tone="neutral" />
          <SummaryCard label="Upcoming" value={String(data?.summary.upcomingCount ?? 0)} tone="upcoming" />
          <SummaryCard label="In Progress" value={String(data?.summary.inProgressCount ?? 0)} tone="live" />
          <SummaryCard label="Completed" value={String(data?.summary.completedCount ?? 0)} tone="done" />
        </div>

        <MovePanel>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1ebe8] px-5 py-4">
            <div>
              <h1 className="text-[1.45rem] font-semibold tracking-tight text-[#1f1f22]">Giám sát danh sách trận đấu</h1>
              <p className="mt-1 text-sm text-[#8b8580]">
                Admin có thể xem toàn bộ trận đấu, lịch sử thi đấu và truy cập trang quản trị chi tiết của từng trận.
              </p>
              {data?.generatedAt ? (
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[#b1aaa5]">
                  Cập nhật gần nhất: {formatDate(data.generatedAt)} {formatTime(data.generatedAt)}
                </p>
              ) : null}
            </div>

            <MoveButton size="sm" leadingIcon={<PlusIcon className="h-4 w-4" />} onClick={() => navigate('/races/new')}>
              Tạo trận đấu mới
            </MoveButton>
          </div>

          {isLoading ? (
            <div className="px-5 py-10 text-sm text-[#8b8580]">Đang tải danh sách trận đấu...</div>
          ) : null}

          {!isLoading && error ? (
            <div className="px-5 py-10 text-sm text-[#b43b35]">Không thể tải dữ liệu trận đấu từ máy chủ.</div>
          ) : null}

          {!isLoading && !error ? (
            <>
              <div className="overflow-x-auto px-5 py-5">
                <table className="min-w-full text-left">
                  <thead className="bg-[#faf8f7] text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#908883]">
                    <tr>
                      <th className="rounded-l-xl px-4 py-3">Trận đấu</th>
                      <th className="px-4 py-3">Ngày diễn ra</th>
                      <th className="px-4 py-3">Thời gian</th>
                      <th className="px-4 py-3">Thời lượng</th>
                      <th className="px-4 py-3">Đội chơi</th>
                      <th className="px-4 py-3">Checkpoint</th>
                      <th className="px-4 py-3">Trạng thái</th>
                      <th className="rounded-r-xl px-4 py-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-[#47413e]">
                    {visibleRows.length ? visibleRows.map((row) => (
                      <tr
                        className="cursor-pointer border-b border-[#f3eeeb] transition hover:bg-[#fcfaf9]"
                        key={row.id}
                        onClick={() => navigate(`/races/${row.id}`)}
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-semibold text-[#2f2b2a]">{row.name}</p>
                            <p className="mt-1 text-xs text-[#8b8580]">{row.location || 'Chưa cập nhật địa điểm'}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[#6d6662]">{formatDate(row.startAt)}</td>
                        <td className="px-4 py-4 text-[#6d6662]">{formatTime(row.startAt)} - {formatTime(row.endAt)}</td>
                        <td className="px-4 py-4 text-[#6d6662]">{formatDuration(row.durationMinutes)}</td>
                        <td className="px-4 py-4 text-[#6d6662]">{row.participantCount}</td>
                        <td className="px-4 py-4 text-[#6d6662]">{row.completedCheckpoints}/{row.completedCheckpoints + row.pendingCheckpoints}</td>
                        <td className="px-4 py-4">
                          <MoveStatusBadge status={row.status} label={row.status === 'live' ? 'In Progress' : row.status === 'done' ? 'Completed' : 'Upcoming'} />
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <MoveButton
                              size="xs"
                              variant="secondary"
                              onClick={(event) => {
                                event.stopPropagation()
                                navigate(`/races/${row.id}`)
                              }}
                            >
                              Chi tiết
                            </MoveButton>
                            <MoveButton
                              size="xs"
                              onClick={(event) => {
                                event.stopPropagation()
                                navigate(`/races/${row.id}/edit`)
                              }}
                            >
                              Chỉnh sửa
                            </MoveButton>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td className="px-4 py-10 text-center text-sm text-[#9d9792]" colSpan={8}>
                          Chưa có trận đấu nào để hiển thị.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <MovePagination
                page={safePage}
                pageSize={PAGE_SIZE}
                totalItems={rows.length}
                totalPages={totalPages}
                onChange={setPage}
              />
            </>
          ) : null}
        </MovePanel>
      </section>
    </main>
  )
}

const SummaryCard = ({ label, tone, value }: { label: string; value: string; tone: 'neutral' | 'upcoming' | 'live' | 'done' }) => {
  const toneMap = {
    neutral: 'border-[#efe8e5] bg-white text-[#2f2b2a]',
    upcoming: 'border-[#f4ead9] bg-[#fffaf1] text-[#b7791f]',
    live: 'border-[#d7f1e4] bg-[#f3fdf7] text-[#15803d]',
    done: 'border-[#e9e8e7] bg-[#f8f7f6] text-[#5b5a58]',
  } satisfies Record<'neutral' | 'upcoming' | 'live' | 'done', string>

  return (
    <div className={`rounded-[1.25rem] border px-4 py-4 shadow-[0_8px_24px_rgba(17,24,39,0.04)] ${toneMap[tone]}`}>
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em]">{label}</p>
      <p className="mt-3 text-[1.8rem] font-semibold tracking-tight">{value}</p>
    </div>
  )
}
