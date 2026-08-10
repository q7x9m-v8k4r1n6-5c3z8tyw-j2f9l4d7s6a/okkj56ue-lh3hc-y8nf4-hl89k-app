import { MapIcon } from '@/core/assets'

export const TeamMapView = () => {
  return (
    <section
      className="flex min-h-[calc(100svh-137px)] flex-col items-center justify-center px-5 py-6 text-center"
      aria-label="Bản đồ trận đấu"
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#f7f7f7] text-[#de3336] shadow-sm">
        <MapIcon className="size-8" />
      </div>
      <h1 className="text-lg font-bold text-[#111111]">Bản đồ trận đấu</h1>
      <p className="mt-2 text-sm text-[#737373]">
        Tính năng đang cập nhật
      </p>
    </section>
  )
}
