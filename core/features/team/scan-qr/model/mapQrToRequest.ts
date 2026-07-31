import type { ScanQrRequest } from './scanQr.contract'

export const mapQrToRequest = (rawQrCode: string, currentTeamId: string): ScanQrRequest => ({
  boothId: rawQrCode.trim(), // Giả định chuỗi QR chứa BoothId
  teamId: currentTeamId,
})