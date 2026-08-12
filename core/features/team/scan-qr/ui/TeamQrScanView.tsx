import { useTeamQrScanPage } from './hooks/useTeamQrScanPage'
import { QrScannerBox } from './components/QrScannerBox'

export const TeamQrScanView = () => {
  const page = useTeamQrScanPage()

  return (
    <section className="mx-auto flex min-h-[calc(100svh-128px)] w-full max-w-md flex-col items-center px-5 pt-16">
      <h1 className="text-[22px] font-semibold leading-7 text-[#111]">
        Quét mã QR
      </h1>

      {page.canScan ? <QrScannerBox onScan={page.handleScan} /> : null}

      {page.errorMessage && (
        <p className="mt-4 text-sm font-medium text-red-600">{page.errorMessage}</p>
      )}
      {page.isCheckingSession ? (
        <p className="mt-12 text-sm text-gray-500">
          Đang kiểm tra phiên trạm hiện tại...
        </p>
      ) : null}
      {page.isSessionError ? (
        <div className="mt-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-medium text-red-600">
            Không thể tải phiên trạm hiện tại.
          </p>
          <button
            className="rounded-md border border-[#5d0004] px-4 py-2 text-sm font-semibold text-[#5d0004]"
            type="button"
            onClick={page.retrySession}
          >
            Thử lại
          </button>
        </div>
      ) : null}
      {page.statusMessage ? (
        <p
          className={`mt-4 text-center text-sm font-medium ${
            page.sessionStatus === 'occupied'
              ? 'text-[#5d0004]'
              : 'text-green-600'
          }`}
        >
          {page.statusMessage}
        </p>
      ) : null}

      {page.canScan ? (
        <div className="mt-8 flex w-full max-w-xs flex-col gap-2">
          <input
            type="text"
            placeholder="Nhập mã QR rồi nhấn Enter..."
            value={page.rawQrCode}
            onChange={page.handleQrCodeChange}
            onKeyDown={page.handleQrCodeKeyDown}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5d0004]"
          />
        </div>
      ) : null}
    </section>
  )
}
