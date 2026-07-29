import type { ScanQrRequest } from './scanQr.contract'

export const mapQrToRequest = (rawQrCode: string): ScanQrRequest => ({
  stationCode: rawQrCode.trim(),
})