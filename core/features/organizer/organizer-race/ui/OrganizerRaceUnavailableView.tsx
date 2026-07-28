export type OrganizerRaceUnavailableViewProps = {
  message: string
  onReturnToRaceList: () => void
}

export const OrganizerRaceUnavailableView = ({
  message,
  onReturnToRaceList,
}: OrganizerRaceUnavailableViewProps) => (
  <section className="flex min-h-full flex-col items-center justify-center px-5 py-12 text-center">
    <h1 className="text-2xl font-bold text-[#323232]">{message}</h1>
    <p className="mt-3 max-w-[18rem] text-sm text-[#737373]">
      Quản trạm chỉ có thể vào trận đấu đang diễn ra.
    </p>
    <button
      type="button"
      className="mt-8 h-11 rounded-md bg-[#de3336] px-6 text-sm font-bold text-white transition-colors hover:bg-[#c92d30]"
      onClick={onReturnToRaceList}
    >
      Quay lại danh sách trận đấu
    </button>
  </section>
)
