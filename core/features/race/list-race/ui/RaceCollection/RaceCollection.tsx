import { RaceCard } from '@/core/entities/race'
import { useRaceCollection } from './useRaceCollection'
import { useListRacesMutation } from '../../hooks/useListRacesMutation'
import { Pagination } from '@/core/shared'

export const RaceCollection = () => {
  const racesQuery = useListRacesMutation()
  const rawRaces = racesQuery.data ?? []

  const {
    races: paginatedRaces,
    page,
    totalPages,
    totalItems,
    startItem,
    endItem,
    setPage
  } = useRaceCollection(rawRaces)

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="Danh sách trận đấu">
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        {racesQuery.isPending ? (
          <div className="rounded-xl border border-dashed border-[#eeeeee] px-4 py-10 text-center text-sm text-[#737373]">Đang tải danh sách trận đấu...</div>
        ) : racesQuery.isError ? (
          <div className="rounded-xl border border-dashed border-[#eeeeee] px-4 py-10 text-center text-sm text-[#737373]">{racesQuery.error instanceof Error ? racesQuery.error.message : 'Không thể tải danh sách trận đấu.'}</div>
        ) : paginatedRaces.length ? (
          <div className="space-y-[42px]">
            {/* 🔌 LIÊN KẾT LINH KIỆN: Duyệt qua mảng dữ liệu đã được tối ưu hóa trạng thái */}
            {paginatedRaces.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#eeeeee] px-4 py-10 text-center text-sm text-[#737373]">Chưa có trận đấu nào để hiển thị.</div>
        )}
      </div>

      <div className="mt-6 border-t border-[#eeeeee]">
        <p className="sr-only">Hiển thị {startItem}-{endItem} / {totalItems}</p>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  )
}