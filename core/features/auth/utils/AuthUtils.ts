// Tách hàm xử lý text lỗi ra khỏi UI, thuần logic Javascript
export const getErrorMessage = (err: unknown, defaultMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại.'): string => {
  const errorObj = err as any
  if (errorObj?.data?.message) return errorObj.data.message
  if (errorObj?.message) return errorObj.message
  return defaultMessage
}