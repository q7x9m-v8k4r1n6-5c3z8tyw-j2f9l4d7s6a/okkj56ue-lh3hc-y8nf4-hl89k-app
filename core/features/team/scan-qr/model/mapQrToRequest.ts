import type { ScanQrRequest } from './scanQr.contract'

export const mapQrToRequest = (rawQrCode: string): ScanQrRequest => ({
  boothId: rawQrCode.trim(),
})
