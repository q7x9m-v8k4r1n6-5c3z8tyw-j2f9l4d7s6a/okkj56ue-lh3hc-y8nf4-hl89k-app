import { useSearchParams } from 'react-router-dom'
import { EnterStationIcon } from '@/core/assets'
import { StatusBanner } from '@/core/shared/ui/StatusBanner'
import {
  ORGANIZER_RACE_REQUESTS_TAB,
  ORGANIZER_RACE_TAB_PARAM,
} from '@/core/shared/utils/organizerRaceRoute'
import { useOrganizerJoinRequests } from './hooks/useOrganizerJoinRequests'

export const OrganizerJoinRequestsView = () => {
  const [searchParams] = useSearchParams()
  const joinRequests = useOrganizerJoinRequests()
  const isActiveTab =
    searchParams.get(ORGANIZER_RACE_TAB_PARAM) === ORGANIZER_RACE_REQUESTS_TAB
  const visibilityClassName = isActiveTab ? '' : 'hidden'

  if (joinRequests.acceptedRequest) {
    return (
      <section className={`flex min-h-[calc(100svh-137px)] flex-col justify-between px-6 pb-5 pt-4 ${visibilityClassName}`}>
        <div>
          {joinRequests.statusMessage ? (
            <StatusBanner
              message={joinRequests.statusMessage}
              variant={joinRequests.statusVariant}
              onClose={joinRequests.clearStatusMessage}
              className="mb-4"
            />
          ) : null}

          <label className="sr-only" htmlFor="organizer-score-input">
            Nhập điểm cho đội
          </label>
          <input
            id="organizer-score-input"
            inputMode="numeric"
            className="h-[42px] w-full rounded-md border border-[#e5e5e5] px-4 text-[13px] text-[#323232] outline-none transition placeholder:text-[#9ca3af] focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10"
            placeholder={`Nhập điểm cho đội ${joinRequests.acceptedRequest.teamName}`}
            value={joinRequests.score}
            onChange={(event) => joinRequests.setScore(event.target.value)}
          />

          <div className="mt-[26px] grid grid-cols-3 justify-between gap-y-[30px]">
            {joinRequests.scoreOptions.map((scoreOption) => {
              const isSelected = joinRequests.score === String(scoreOption)

              return (
                <button
                  key={scoreOption}
                  type="button"
                  className={`flex aspect-[102/119] w-[clamp(84px,27vw,102px)] min-w-0 flex-col items-center justify-center rounded-lg border-2 text-[#040000] transition ${
                    isSelected
                      ? 'border-[#de3336] bg-[#de3336]/5 shadow-[0_0_0_2px_rgba(222,51,54,0.08)]'
                      : 'border-[#e5e5e5] bg-white hover:border-[#de3336]/50'
                  }`}
                  onClick={() => joinRequests.selectScore(scoreOption)}
                >
                  <span className="text-[30px] font-bold leading-9">{scoreOption}</span>
                  <span className="mt-1 text-[10px] font-bold uppercase leading-3 text-[#5e5e5e]">
                    điểm
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-3">
          {joinRequests.errorMessage ? (
            <p className="text-center text-sm font-medium text-red-600" role="alert">
              {joinRequests.errorMessage}
            </p>
          ) : null}
          <button
            type="button"
            className="h-[42px] w-full rounded-md bg-[#de3336] text-sm font-bold text-white transition-colors hover:bg-[#c92d30] disabled:cursor-not-allowed disabled:bg-[#ef9a9c]"
            disabled={!joinRequests.canSubmitScore || joinRequests.isSubmitting || joinRequests.isCancelling}
            onClick={joinRequests.submitScore}
          >
            {joinRequests.isSubmitting ? 'Đang gửi...' : 'Xác nhận'}
          </button>
          <button
            type="button"
            className="h-[42px] w-full rounded-md border border-[#e5e5e5] bg-white text-sm font-bold text-[#564240] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={joinRequests.isSubmitting || joinRequests.isCancelling}
            onClick={joinRequests.cancelSession}
          >
            {joinRequests.isCancelling ? 'Đang hủy...' : 'Hủy'}
          </button>
        </div>
      </section>
    )
  }

  if (!joinRequests.request) {
    return (
      <section className={`flex min-h-[calc(100svh-137px)] flex-col px-5 pb-5 pt-4 ${visibilityClassName}`}>
        {joinRequests.statusMessage ? (
          <StatusBanner
            message={joinRequests.statusMessage}
            variant={joinRequests.statusVariant}
            onClose={joinRequests.clearStatusMessage}
            className="mb-4"
          />
        ) : null}
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-sm text-[#525252]">
            {joinRequests.isLoading
              ? 'Đang tải trạng thái trạm...'
              : 'Chưa có yêu cầu nào xuất hiện'}
          </p>
        </div>
        {joinRequests.errorMessage ? (
          <p className="text-center text-sm font-medium text-red-600" role="alert">
            {joinRequests.errorMessage}
          </p>
        ) : null}
      </section>
    )
  }

  return (
    <section className={`flex min-h-[calc(100svh-137px)] flex-col px-5 pb-10 pt-4 ${visibilityClassName}`}>
      {joinRequests.statusMessage ? (
        <StatusBanner
          message={joinRequests.statusMessage}
          variant={joinRequests.statusVariant}
          onClose={joinRequests.clearStatusMessage}
          className="mb-4"
        />
      ) : null}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <EnterStationIcon className="mb-6 size-[50px] text-[#de3336]" />
        <h1 className="text-[32px] font-bold leading-10 text-[#5e5e5e]">
          {joinRequests.request.teamName}
        </h1>
        <p className="mt-2 text-sm text-[#8a8a8a]">yêu cầu tham gia trạm</p>
      </div>

      <div className="space-y-3 pb-1">
        <button
          type="button"
          className="h-[42px] w-full rounded-md bg-[#de3336] text-sm font-bold text-white transition-colors hover:bg-[#c92d30] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={joinRequests.isAccepting || joinRequests.isRejecting}
          onClick={joinRequests.acceptRequest}
        >
          {joinRequests.isAccepting ? 'Đang duyệt...' : 'Đồng ý'}
        </button>
        <button
          type="button"
          className="h-11 w-full rounded-md border border-[#e5e5e5] bg-white text-sm font-bold text-[#564240] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={joinRequests.isAccepting || joinRequests.isRejecting}
          onClick={joinRequests.rejectRequest}
        >
          {joinRequests.isRejecting ? 'Đang từ chối...' : 'Hủy'}
        </button>
        {joinRequests.errorMessage ? (
          <p className="text-center text-sm font-medium text-red-600" role="alert">
            {joinRequests.errorMessage}
          </p>
        ) : null}
      </div>
    </section>
  )
}
