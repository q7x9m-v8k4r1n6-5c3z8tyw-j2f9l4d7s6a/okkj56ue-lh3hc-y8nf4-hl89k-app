import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

/**
 * Quản lý lifecycle của Camera và luồng quét QR.
 * Chỉ xử lý 1 lần quét thành công, sau đó tạm dừng camera để tránh gọi lặp.
 */
export const useCameraScanner = (onScanSuccess: (qrCode: string) => void) => {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const hasScannedRef = useRef(false)
  const onScanSuccessRef = useRef(onScanSuccess)

  useEffect(() => {
    onScanSuccessRef.current = onScanSuccess
  }, [onScanSuccess])

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader-element')
    scannerRef.current = scanner
    hasScannedRef.current = false

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 200, height: 200 } },
      (decodedText) => {
        if (hasScannedRef.current) return
        hasScannedRef.current = true

        if (scannerRef.current?.isScanning) {
          scannerRef.current.pause(true)
        }

        onScanSuccessRef.current(decodedText)
      },
      () => { /* Ignore frame errors */ }
    ).catch((err) => {
      console.error('Không thể bật Camera:', err)
    })

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])
}