import { useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'

/**
 * Quản lý lifecycle của Camera và luồng quét QR
 */
export const useCameraScanner = (onScanSuccess: (qrCode: string) => void) => {
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    const scanner = new Html5Qrcode('qr-reader-element')
    scannerRef.current = scanner

    scanner.start(
      { facingMode: 'environment' }, 
      { fps: 10, qrbox: { width: 200, height: 200 } },
      (decodedText) => {
        onScanSuccess(decodedText)
      },
      () => { /* Ignore frame errors */ }
    ).catch((err) => {
      console.error('Không thể bật Camera:', err)
    })

    // Cleanup khi component bị unmount
    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [onScanSuccess])
}