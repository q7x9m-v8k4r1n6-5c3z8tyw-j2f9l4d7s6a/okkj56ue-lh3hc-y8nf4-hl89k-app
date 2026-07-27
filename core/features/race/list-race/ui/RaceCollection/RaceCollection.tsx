import { RaceCard } from '@/core/entities/race'
import { Pagination } from '@/core/shared'
import { useRaceCollection } from '../hooks/useRaceCollection'

export const RaceCollection = () => {
  const {
    errorMessage,
    isError,
    isLoading,
    openRaceDetail,
    page,
    races,
    setPage,
    summary,
    totalPages,
  } = useRaceCollection()

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label="Danh sách trận đấu">
      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="rounded-xl border border-dashed border-[#eeeeee] px-4 py-10 text-center text-sm text-[#737373]">Đang tải danh sách trận đấu...</div>
        ) : isError ? (
          <div className="rounded-xl border border-dashed border-[#eeeeee] px-4 py-10 text-center text-sm text-[#737373]">{errorMessage}</div>
        ) : races.length ? (
          <div className="space-y-[42px]">
            {races.map((race) => (
              <RaceCard
                key={race.id}
                race={race}
                onSelect={openRaceDetail}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#eeeeee] px-4 py-10 text-center text-sm text-[#737373]">Chưa có trận đấu nào để hiển thị.</div>
        )}
      </div>

      <div className="mt-6 border-t border-[#eeeeee]">
        <p className="sr-only">
          Hiển thị {summary.startItem}-{summary.endItem} / {summary.totalItems}
        </p>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  )
}
