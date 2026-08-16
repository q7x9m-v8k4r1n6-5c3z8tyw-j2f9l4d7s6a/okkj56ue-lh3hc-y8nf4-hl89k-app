import { ArrowLeftIcon } from '@/core/assets'
import { useOrganizerAnnouncementHistory } from './hooks/useOrganizerAnnouncementHistory'

export const OrganizerAnnouncementHistoryView = () => {
  const history = useOrganizerAnnouncementHistory()

  return (
    <section
      className="min-h-[calc(100svh-137px)] px-5 py-6"
      aria-labelledby="organizer-announcement-history-title"
    >
      <button
        type="button"
        id="organizer-announcement-history-title"
        className="mx-auto mb-6 flex h-7 items-center justify-center gap-3 text-[16px] font-semibold text-[#202020]"
        onClick={history.backToMenu}
      >
        <ArrowLeftIcon className="size-5" />
        Lịch sử thông báo
      </button>

      <div>
        {history.isLoading ? (
          <p className="py-10 text-center text-sm text-[#737373]">
            Đang tải lịch sử thông báo...
          </p>
        ) : null}

        {history.isError ? (
          <div className="py-10 text-center text-sm text-[#737373]">
            <p>Không thể tải lịch sử thông báo.</p>
            <button
              type="button"
              className="mt-2 font-medium text-[#de3336]"
              onClick={() => void history.retry()}
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!history.isLoading && !history.isError && history.items.length === 0 ? (
          <p className="py-10 text-center text-sm text-[#737373]">
            Chưa có thông báo nào.
          </p>
        ) : null}

        {!history.isLoading && !history.isError ? history.items.map((item) => (
          <article
            key={item.id}
            className="min-h-[67px] border-b border-[#dcc0bd]/30 py-4"
          >
            <p className="whitespace-pre-wrap text-sm leading-5 text-[#564240]">
              <span className="font-semibold">{item.senderName}: </span>
              {item.body}
            </p>
            <time className="mt-3 block text-xs leading-4 text-[#5e5e5e]">{item.sentAt}</time>
          </article>
        )) : null}
      </div>
    </section>
  )
}
