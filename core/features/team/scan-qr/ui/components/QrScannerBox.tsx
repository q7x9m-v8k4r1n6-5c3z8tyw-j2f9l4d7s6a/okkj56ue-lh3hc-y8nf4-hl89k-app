import { useCameraScanner } from '../hooks/useCameraScanner'

interface QrScannerBoxProps {
  onScan: (qrCode: string) => void
}

export const QrScannerBox = ({ onScan }: QrScannerBoxProps) => {
  // Gắn Side-effect Camera vào Sub-component này
  useCameraScanner(onScan)

  return (
    <div className="relative mt-12 size-[250px] overflow-hidden rounded-lg">
      {/* Vùng chứa luồng Video từ Webcam */}
      <div id="qr-reader-element" className="h-full w-full object-cover" />

      {/* Các đường viền góc trang trí */}
      <span className="pointer-events-none absolute -left-1 -top-1 h-10 w-10 border-l-4 border-t-4 border-[#5d0004]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-10 w-10 border-r-4 border-t-4 border-[#5d0004]" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-10 w-10 border-b-4 border-l-4 border-[#5d0004]" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-10 w-10 border-b-4 border-r-4 border-[#5d0004]" />
    </div>
  )
}