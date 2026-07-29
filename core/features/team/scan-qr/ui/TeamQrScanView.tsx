import { useTeamQrScanPage } from './hooks/useTeamQrScanPage'

export const TeamQrScanView = () => {
  const page = useTeamQrScanPage()

  return (
    <section className="flex min-h-[calc(100svh-128px)] flex-col items-center px-5 pt-16">
      <h1 className="text-[22px] font-semibold leading-7 text-[#111]">
        Quét mã QR
      </h1>

      <div className="relative mt-12 size-[250px]">
        <div className="absolute inset-0 border border-[#5d0004]" />
        <div className="absolute inset-[36px] border border-[#d5d5d5]" />
        <span className="absolute -left-1 -top-1 h-10 w-10 border-l-4 border-t-4 border-[#5d0004]" />
        <span className="absolute -right-1 -top-1 h-10 w-10 border-r-4 border-t-4 border-[#5d0004]" />
        <span className="absolute -bottom-1 -left-1 h-10 w-10 border-b-4 border-l-4 border-[#5d0004]" />
        <span className="absolute -bottom-1 -right-1 h-10 w-10 border-b-4 border-r-4 border-[#5d0004]" />
      </div>

      {/* Thông báo lỗi nếu có */}
      {page.errorMessage && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {page.errorMessage}
        </p>
      )}

      {/* ⏳ Hiển thị trạng thái đang gửi tín hiệu lên Server */}
      {page.isPending && (
        <p className="mt-4 text-sm text-gray-500">Đang gửi dữ liệu trạm...</p>
      )}

      {/* Hiển thị trạng thái thành công */}
      {page.isSuccess && (
        <p className="mt-4 text-sm font-medium text-green-600">
          ✅ Vào trạm thành công! {page.responseData?.stationName}
        </p>
      )}

      <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
        <input
          type="text"
          placeholder="Nhập hoặc quét mã QR trạm..."
          value={page.rawQrCode}
          onChange={(e) => page.handleScan(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5d0004]"
        />
      </div>
    </section>
  )
}