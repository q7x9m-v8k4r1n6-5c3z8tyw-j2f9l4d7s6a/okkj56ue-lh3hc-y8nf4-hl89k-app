const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

/** Extracts a safe user-facing message from an unknown API error. */
export const getAuthErrorMessage = (
  error: unknown,
  fallback = 'Đã có lỗi xảy ra. Vui lòng thử lại.',
) => {
  if (!isRecord(error)) return fallback
  if (typeof error.message === 'string') return error.message
  if (
    isRecord(error.data)
    && typeof error.data.message === 'string'
  ) return error.data.message
  return fallback
}
