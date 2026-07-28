import { RaceCard } from '@/core/entities/race'
import { ORGANIZER_RACE_UNAVAILABLE_MESSAGE } from '@/core/features/organizer/organizer-race'
import { Pagination } from '@/core/shared'
import { useOrganizerRaceCollection } from './hooks/useOrganizerRaceCollection'

export const OrganizerRaceCollection = () => {
  const {
    errorMessage,
    isError,
    isLoading,
    isRaceSelectable,
    openRaceDetail,
    page,
    races,
    setPage,
    summary,
    totalPages,
  } = useOrganizerRaceCollection()

  return (
    <section className="flex min-h-0 flex-1 flex-col px-5 py-6" aria-label="Danh sách trận đấu">
      <h1 className="mb-5 text-[23px] font-bold leading-8 text-[#111]">
        Chọn một trận đấu để quản trạm
      </h1>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        {isLoading ? (
          <div className="rounded-xl border border-dashed border-[#eeeeee] px-4 py-10 text-center text-sm text-[#737373]">
            Đang tải danh sách trận đấu...
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-dashed border-[#eeeeee] px-4 py-10 text-center text-sm text-[#737373]">
            {errorMessage}
          </div>
        ) : races.length ? (
          <div className="space-y-6">
            {races.map((race) => {
              const isSelectable = isRaceSelectable(race)

              return (
                <RaceCard
                  key={race.id}
                  disabled={!isSelectable}
                  disabledReason={!isSelectable ? ORGANIZER_RACE_UNAVAILABLE_MESSAGE : undefined}
                  race={race}
                  onSelect={() => openRaceDetail(race)}
                />
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#eeeeee] px-4 py-10 text-center text-sm text-[#737373]">
            Chưa có trận đấu nào để hiển thị.
          </div>
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
