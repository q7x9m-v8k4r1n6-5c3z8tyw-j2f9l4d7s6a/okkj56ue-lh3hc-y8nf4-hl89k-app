import { useTeamQrScanPage } from './hooks/useTeamQrScanPage'
import { QrScannerBox } from './components/QrScannerBox'

export const TeamQrScanView = () => {
  const page = useTeamQrScanPage()

  return (
    <section className="mx-auto flex min-h-[calc(100svh-128px)] w-full max-w-md flex-col items-center px-5 pt-16">
      <h1 className="text-[22px] font-semibold leading-7 text-[#111]">
        Quét mã QR
      </h1>

      <QrScannerBox onScan={page.handleScan} />

      {page.errorMessage && (
        <p className="mt-4 text-sm font-medium text-red-600">{page.errorMessage}</p>
      )}
      {page.isPending && (
        <p className="mt-4 text-sm text-gray-500">Đang gửi dữ liệu trạm...</p>
      )}
      {page.isSuccess && (
        <p className="mt-4 text-sm font-medium text-green-600">
          {page.responseData?.message ?? 'Vào trạm thành công!'}
        </p>
      )}

      <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
        <input
          type="text"
          placeholder="Nhập mã QR rồi nhấn Enter..."
          value={page.rawQrCode}
          onChange={(e) => page.form.setRawQrCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') page.handleScan(page.rawQrCode)
          }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5d0004]"
        />
      </div>
    </section>
  )
}