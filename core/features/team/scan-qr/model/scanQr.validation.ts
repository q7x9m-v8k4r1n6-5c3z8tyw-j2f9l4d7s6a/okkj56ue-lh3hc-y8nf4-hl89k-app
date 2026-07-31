export const validateQrCode = (code: string): string | null => {
  if (!code || !code.trim()) {
    return 'Vui lòng quét hoặc nhập mã QR hợp lệ'
  }
  return null
}