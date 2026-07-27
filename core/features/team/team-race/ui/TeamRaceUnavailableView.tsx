export type TeamRaceUnavailableViewProps = {
  message: string
  onReturnToRaceList: () => void
}

export const TeamRaceUnavailableView = ({
  message,
  onReturnToRaceList,
}: TeamRaceUnavailableViewProps) => (
  <section className="flex min-h-full flex-col items-center justify-center px-5 py-12 text-center">
    <div className="max-w-[280px] space-y-5">
      <p className="text-base font-medium text-[#de3336]">{message}</p>
      <button
        type="button"
        className="h-11 rounded-lg border border-[#dedede] px-5 text-sm font-medium text-[#323232] transition-colors hover:bg-[#f7f7f7]"
        onClick={onReturnToRaceList}
      >
        Quay lại danh sách trận đấu
      </button>
    </div>
  </section>
)
