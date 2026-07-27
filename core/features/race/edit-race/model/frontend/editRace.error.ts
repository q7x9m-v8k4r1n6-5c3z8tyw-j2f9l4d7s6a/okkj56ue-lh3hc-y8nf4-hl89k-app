type ApiError = {
  message?: string
  status?: number
}

/** Extracts a readable message from Error and normalized API errors. */
export const getEditRaceErrorMessage = (
  error: unknown,
  fallback: string,
) => {
  if (error instanceof Error) return error.message
  if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }
  return fallback
}

/** Identifies an optimistic-concurrency response from the API client. */
export const isEditRaceConflict = (error: unknown) =>
  Boolean(
    error &&
      typeof error === 'object' &&
      (error as ApiError).status === 409,
  )
