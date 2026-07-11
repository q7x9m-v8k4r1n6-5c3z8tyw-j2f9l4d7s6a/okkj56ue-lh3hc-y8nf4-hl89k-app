import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PlusIcon } from '@/core/assets'
import { RaceCard } from '@/core/entities/race'
import { Button, MovePagination, MovePanel, useToast } from '@/core/shared'
import { getRaceRecords } from '@/core/shared/lib'

type PageState = {
  toastMessage?: string
}

const PAGE_SIZE = 20

export const RaceListPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [rows] = useState(() => getRaceRecords())

  useEffect(() => {
    const state = location.state as PageState | null
    if (!state?.toastMessage) return

    toast({
      title: 'Thông báo',
      description: state.toastMessage,
    })

    navigate(location.pathname, { replace: true, state: {} })
  }, [location.pathname, location.state, navigate, toast])

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const visibleRows = useMemo(() => {
    const startIndex = (safePage - 1) * PAGE_SIZE
    return rows.slice(startIndex, startIndex + PAGE_SIZE)
  }, [rows, safePage])

  return (
    <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
      <section className="w-full">
        <MovePanel>
          <div className="border-b border-[#f1ebe8] px-5 py-4">
            <div className="flex items-center justify-end">
              <Button size="sm" leadingIcon={<PlusIcon className="h-4 w-4" />} onClick={() => navigate('/races/new')}>
                Tạo trận đấu mới
              </Button>
            </div>
          </div>

          <div className="max-h-[38rem] space-y-5 overflow-auto px-5 py-5">
            {visibleRows.length ? visibleRows.map((row) => (
              <RaceCard
                key={row.id}
                race={row}
                onView={() => navigate(`/races/${row.id}`)}
                onEdit={() => navigate(`/races/${row.id}/edit`)}
              />
            )) : (
              <div className="rounded-2xl border border-dashed border-[#ece5e1] bg-[#fbf9f8] px-4 py-10 text-center text-sm text-[#9d9792]">
                Chưa có trận đấu nào để hiển thị.
              </div>
            )}
          </div>

          <MovePagination
            page={safePage}
            pageSize={PAGE_SIZE}
            totalItems={rows.length}
            totalPages={totalPages}
            onChange={setPage}
          />
        </MovePanel>
      </section>
    </main>
  )
}
