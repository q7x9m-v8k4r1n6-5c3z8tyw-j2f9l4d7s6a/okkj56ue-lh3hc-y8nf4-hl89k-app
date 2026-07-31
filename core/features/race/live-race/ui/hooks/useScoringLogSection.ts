import { useState } from 'react'
import { useScoringLogQuery } from '../../model/server/useLiveQueries'

/**
 * Manages pagination state and connects scoring logs to presentation.
 */
export const useScoringLogSection = (raceId?: string) => {
  const [page, setPage] = useState(1)
  const pageSize = 10 // Số item trên mỗi trang

  const query = useScoringLogQuery(raceId, page, pageSize)

  return {
    logs: query.data?.items ?? [],
    page: query.data?.page ?? 1,
    totalPages: query.data?.totalPages ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    onNextPage: () => setPage((current) => current + 1),
    onPrevPage: () => setPage((current) => Math.max(1, current - 1)),
  }
}