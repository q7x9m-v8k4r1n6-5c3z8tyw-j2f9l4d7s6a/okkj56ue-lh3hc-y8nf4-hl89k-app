import { HistoryIcon } from '@/core/assets'
import { useOrganizerScoringHistory } from './hooks/useOrganizerScoringHistory'

const scoreToneClassName = {
  negative: 'text-[#de3336]',
  neutral: 'text-[#525252]',
  positive: 'text-[#148f45]',
} as const

export const OrganizerHistoryView = () => {
  const history = useOrganizerScoringHistory()

  return (
    <section
      className="min-h-[calc(100svh-137px)] px-5 py-5"
      aria-labelledby="organizer-scoring-history-title"
    >
      <div className="mb-5 flex items-center justify-center gap-3">
        <HistoryIcon className="size-6 text-[#323232]" />
        <h1
          id="organizer-scoring-history-title"
          className="text-[20px] font-bold leading-7 text-[#040000]"
        >
          Lịch sử cho điểm
        </h1>
      </div>

      {history.isLoading ? (
        <p className="py-12 text-center text-sm text-[#737373]">
          Đang tải lịch sử cho điểm...
        </p>
      ) : null}

      {history.isError ? (
        <div className="py-12 text-center">
          <p className="text-sm text-[#de3336]">Không thể tải lịch sử cho điểm.</p>
          <button
            type="button"
            className="mt-3 text-sm font-semibold text-[#de3336]"
            onClick={() => void history.retry()}
          >
            Tải lại
          </button>
        </div>
      ) : null}

      {!history.isLoading && !history.isError && history.items.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center text-[#737373]">
          <HistoryIcon className="mb-4 size-12 text-[#d4d4d4]" />
          <p className="text-sm">Chưa có lịch sử cho điểm</p>
        </div>
      ) : null}

      {!history.isLoading && !history.isError && history.items.length > 0 ? (
        <div className="space-y-3">
          {history.items.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-[#e5e5e5] bg-white px-4 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#323232]">
                    {item.actorName}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#5e5e5e]">
                    {item.description}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-bold ${scoreToneClassName[item.scoreTone]}`}
                >
                  {item.score}
                </span>
              </div>
              <p className="mt-2 text-xs text-[#9a9a9a]">{item.time}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
