import { useCameraScanner } from '../hooks/useCameraScanner'

interface QrScannerBoxProps {
  onScan: (qrCode: string) => void
}

export const QrScannerBox = ({ onScan }: QrScannerBoxProps) => {
  useCameraScanner(onScan)

  return (
    <div className="relative mt-12 size-[250px] overflow-hidden rounded-lg">
      <div
        id="qr-reader-element"
        className="h-full w-full [&_video]:!h-full [&_video]:!w-full [&_video]:!object-cover [&_canvas]:!h-full [&_canvas]:!w-full"
      />

      <span className="pointer-events-none absolute -left-1 -top-1 h-10 w-10 border-l-4 border-t-4 border-[#5d0004]" />
      <span className="pointer-events-none absolute -right-1 -top-1 h-10 w-10 border-r-4 border-t-4 border-[#5d0004]" />
      <span className="pointer-events-none absolute -bottom-1 -left-1 h-10 w-10 border-b-4 border-l-4 border-[#5d0004]" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-10 w-10 border-b-4 border-r-4 border-[#5d0004]" />
    </div>
  )
}
