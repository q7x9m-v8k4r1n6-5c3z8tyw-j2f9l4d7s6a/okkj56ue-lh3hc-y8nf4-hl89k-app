import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useScoringLogQuery } from '../../model/server/useLiveQueries'

/**
 * Manages pagination state and connects scoring logs to presentation.
 */
export const useScoringLogSection = (raceId?: string) => {
  const [page, setPage] = useState(1)
  const pageSize = 10 
  const query = useScoringLogQuery(raceId, page, pageSize)
  const [, setSearchParams] = useSearchParams()

  return {
    logs: query.data?.items ?? [],
    page: query.data?.page ?? 1,
    totalPages: query.data?.totalPages ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    onNextPage: () => setPage((current) => current + 1),
    onPrevPage: () => setPage((current) => Math.max(1, current - 1)),
    
    onViewAll: () => {
      setSearchParams((current) => {
        current.set('tab', 'history')
        return current
      })
    },
  }
}