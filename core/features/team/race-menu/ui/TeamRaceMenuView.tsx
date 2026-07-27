import {
  ArrowLeftIcon,
  LogoutIcon,
  RequestJoinIcon,
} from '@/core/assets'
import { useTeamRaceMenu } from './hooks/useTeamRaceMenu'

export type TeamRaceMenuViewProps = {
  onCancel: () => void
  onReturnToRaceList: () => void
}

export const TeamRaceMenuView = ({
  onCancel,
  onReturnToRaceList,
}: TeamRaceMenuViewProps) => {
  const menu = useTeamRaceMenu()

  return (
    <section className="px-5 py-8">
      <button
        type="button"
        className="flex h-14 w-full items-center justify-center gap-4 border-b border-[#e2e2e2] text-base text-[#323232]"
        onClick={onReturnToRaceList}
      >
        <ArrowLeftIcon className="size-6" />
        <span>Quay lại danh sách trận đấu</span>
      </button>

      <button
        type="button"
        className="flex h-20 w-full items-center justify-center gap-4 border-b border-[#e2e2e2] text-base text-[#323232]"
        onClick={onCancel}
      >
        <RequestJoinIcon className="size-6" />
        <span>Hủy</span>
      </button>

      <button
        type="button"
        className="flex h-20 w-full items-center justify-center gap-4 border-b border-[#e2e2e2] text-base text-[#de3336] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={menu.isLoggingOut}
        onClick={() => void menu.logout()}
      >
        <LogoutIcon className="size-6" />
        <span>Đăng xuất</span>
      </button>
    </section>
  )
}
