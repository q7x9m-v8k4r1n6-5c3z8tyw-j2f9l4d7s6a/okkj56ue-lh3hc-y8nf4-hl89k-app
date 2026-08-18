import { CloseIcon } from '@/core/assets/icons'
import { useRaceMessageNotification } from '../model/frontend/useRaceMessageNotification'

const MegaphoneIcon = ({ className = '' }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3333 7.5V5.83333H16.6667V7.5H13.3333ZM14.3333 13.3333L11.6667 11.3333L12.6667 10L15.3333 12L14.3333 13.3333ZM12.6667 3.33333L11.6667 2L14.3333 0L15.3333 1.33333L12.6667 3.33333ZM2.5 12.5V9.16667H1.66667C1.20833 9.16667 0.815972 9.00347 0.489583 8.67708C0.163194 8.35069 0 7.95833 0 7.5V5.83333C0 5.375 0.163194 4.98264 0.489583 4.65625C0.815972 4.32986 1.20833 4.16667 1.66667 4.16667H5L9.16667 1.66667V11.6667L5 9.16667H4.16667V12.5H2.5ZM7.5 8.70833V4.625L5.45833 5.83333H1.66667V7.5H5.45833L7.5 8.70833ZM10 9.45833V3.875C10.375 4.20833 10.6771 4.61458 10.9062 5.09375C11.1354 5.57292 11.25 6.09722 11.25 6.66667C11.25 7.23611 11.1354 7.76042 10.9062 8.23958C10.6771 8.71875 10.375 9.125 10 9.45833Z"
      fill="currentColor"
    />
  </svg>
)

export const RaceMessageNotificationBanner = () => {
  const notification = useRaceMessageNotification()

  if (!notification.isVisible) return null

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-[92px] z-50 mx-auto flex w-full max-w-md flex-col gap-2 px-5">
      {notification.banners.map((banner) => (
        <div
          className="pointer-events-auto flex min-h-[64px] items-start gap-3 rounded-[10px] bg-[#f8d1d3] px-4 py-3 text-[#564240] shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
          key={banner.id}
        >
          <MegaphoneIcon className="mt-0.5 size-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p
              className="whitespace-pre-wrap break-words text-[15px] leading-5"
              style={banner.isExpanded ? undefined : {
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                display: '-webkit-box',
                overflow: 'hidden',
              }}
            >
              <span className="font-semibold">{banner.senderName}: </span>
              {banner.body}
            </p>
            {banner.isExpandable ? (
              <button
                className="mt-1 text-[13px] font-semibold leading-5 text-[#de3336]"
                type="button"
                onClick={() => notification.toggleExpanded(banner.id)}
              >
                {banner.isExpanded ? 'Thu gọn' : 'Xem thêm'}
              </button>
            ) : null}
          </div>
          <button
            aria-label="Đóng thông báo"
            className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/35"
            type="button"
            onClick={() => notification.dismiss(banner.id)}
          >
            <CloseIcon className="size-5" />
          </button>
        </div>
      ))}
    </div>
  )
}
