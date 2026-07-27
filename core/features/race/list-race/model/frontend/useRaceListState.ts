import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/core/shared'

type RaceListPageState = {
  toastMessage?: string
}

/** Owns browser-only pagination, route state and navigation for race-list. */
export const useRaceListState = () => {
  const [page, setPage] = useState(1)
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const locationState = location.state as RaceListPageState | null

  useEffect(() => {
    if (!locationState?.toastMessage) return
    toast({ title: 'Thông báo', description: locationState.toastMessage })
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.pathname, locationState?.toastMessage, navigate, toast])

  return {
    openRaceDetail: (raceId: string) => navigate(`/races/${raceId}`),
    page,
    setPage,
  }
}
