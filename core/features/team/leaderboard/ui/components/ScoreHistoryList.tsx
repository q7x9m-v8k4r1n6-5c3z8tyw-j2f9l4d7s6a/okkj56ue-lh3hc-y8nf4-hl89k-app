import { HistoryIcon } from '@/core/assets'
import type { ScoreHistoryViewItem } from '../../model/teamLeaderboard.presentation'

type ScoreHistoryListProps = {
  hasMore: boolean
  isError: boolean
  isLoading: boolean
  isLoadingMore: boolean
  items: ScoreHistoryViewItem[]
  onLoadMore: () => void
  onRetry: () => void
}

export const ScoreHistoryList = ({
  hasMore,
  isError,
  isLoading,
  isLoadingMore,
  items,
  onLoadMore,
  onRetry,
}: ScoreHistoryListProps) => (
  <section aria-labelledby="team-score-history-title">
    <h2
      id="team-score-history-title"
      className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-[#202020]"
    >
      <HistoryIcon className="size-[18px]" />
      Lịch sử điểm
    </h2>

    <div className="overflow-hidden rounded-[10px] border border-[#dedede] bg-white px-3">
      {isLoading ? (
        <p className="py-8 text-center text-sm text-[#737373]">
          Đang tải lịch sử điểm...
        </p>
      ) : null}
      {isError ? (
        <div className="py-7 text-center text-sm text-[#737373]">
          <p>Không thể tải lịch sử điểm.</p>
          <button
            type="button"
            className="mt-2 font-medium text-[#de3336]"
            onClick={onRetry}
          >
            Thử lại
          </button>
        </div>
      ) : null}
      {!isLoading && !isError && items.length === 0 ? (
        <p className="py-8 text-center text-sm text-[#737373]">
          Chưa có thay đổi điểm nào.
        </p>
      ) : null}
      {!isLoading && !isError ? items.map((item) => (
        <article
          key={item.id}
          className="flex min-h-[84px] flex-col justify-center border-b border-[#eeeeee] py-3 last:border-b-0"
        >
          <p className="text-xs leading-5 text-[#696969]">{item.description}</p>
          <time className="mt-1 text-[10px] text-[#8a8a8a]">{item.time}</time>
        </article>
      )) : null}
    </div>

    {hasMore && !isError ? (
      <button
        type="button"
        className="mt-3 w-full rounded-lg border border-[#dedede] py-2 text-xs font-medium text-[#555] disabled:opacity-60"
        disabled={isLoadingMore}
        onClick={onLoadMore}
      >
        {isLoadingMore ? 'Đang tải...' : 'Xem thêm'}
      </button>
    ) : null}
  </section>
)
