import { LeaderboardIcon } from '@/core/assets'

export const TeamLeaderboardView = () => (
  <section className="flex min-h-[calc(100svh-128px)] flex-col items-center justify-center px-5 text-center text-[#737373]">
    <LeaderboardIcon className="mb-4 size-12 text-[#d4d4d4]" />
    <p className="text-sm">Chưa có dữ liệu xếp hạng</p>
  </section>
)
