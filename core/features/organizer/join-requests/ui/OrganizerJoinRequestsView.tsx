import { EnterStationIcon } from '@/core/assets'
import { useOrganizerJoinRequests } from './hooks/useOrganizerJoinRequests'

export const OrganizerJoinRequestsView = () => {
  const joinRequests = useOrganizerJoinRequests()

  if (!joinRequests.request) {
    return (
      <section className="flex min-h-[calc(100svh-137px)] items-center justify-center px-5 text-center">
        <p className="text-sm text-[#525252]">Chưa có yêu cầu nào xuất hiện</p>
      </section>
    )
  }

  return (
    <section className="flex min-h-[calc(100svh-137px)] flex-col px-5 py-10">
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
          className="h-[42px] w-full rounded-md bg-[#de3336] text-sm font-bold text-white transition-colors hover:bg-[#c92d30]"
          onClick={joinRequests.acceptRequest}
        >
          Đồng ý
        </button>
        <button
          type="button"
          className="h-11 w-full rounded-md border border-[#e5e5e5] bg-white text-sm font-bold text-[#564240] transition-colors hover:bg-[#fafafa]"
          onClick={joinRequests.rejectRequest}
        >
          Hủy
        </button>
      </div>
    </section>
  )
}
