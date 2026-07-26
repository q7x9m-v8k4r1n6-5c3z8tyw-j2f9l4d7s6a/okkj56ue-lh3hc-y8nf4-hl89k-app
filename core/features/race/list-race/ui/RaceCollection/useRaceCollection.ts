import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/core/shared'
import type { RaceListItem } from '../../models'

type PageState = {
  toastMessage?: string
}

export const useRaceCollection = (races: RaceListItem[]) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const locationState = location.state as PageState | null

  useEffect(() => {
    if (!locationState?.toastMessage) return
    toast({ title: 'Thông báo', description: locationState.toastMessage })
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.pathname, locationState, navigate, toast])

  const visibleRows = useMemo(() => {
    return races.map((race) => ({ ...race, status: race.status ?? 'draft' }))
  }, [races])

  return {
    races: visibleRows,
  }
}
