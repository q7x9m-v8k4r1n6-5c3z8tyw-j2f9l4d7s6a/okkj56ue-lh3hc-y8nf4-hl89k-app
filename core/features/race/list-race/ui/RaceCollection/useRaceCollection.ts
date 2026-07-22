import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/core/shared'
import type { RaceListItem } from '../../models'
// 🔌 HÀN ĐƯỜNG TRUYỀN CHUẨN: Kết nối sang thư mục helpers của create-race
import { getRaceLifecycleStatus } from '../../../create-race/helpers'

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

    // Keep rendering safe if an unexpected API payload reaches this component.
    const visibleRows = useMemo(() => {
        return races.map((race) => ({
            ...race,
            status: getRaceLifecycleStatus(race.timeStart, race.timeEnd)
        }))
    }, [races])

    return {
        races: visibleRows, 
    }
}
