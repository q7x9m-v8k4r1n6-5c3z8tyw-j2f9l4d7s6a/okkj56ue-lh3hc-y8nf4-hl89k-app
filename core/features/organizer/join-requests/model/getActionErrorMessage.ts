export const getActionErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error && 'message' in error) {
    return String((error as { message?: unknown }).message ?? '')
  }

  return 'Không thể thực hiện thao tác. Vui lòng thử lại.'
}
