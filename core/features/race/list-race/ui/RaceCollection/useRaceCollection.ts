import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/core/shared'
import type { ListRacesResponse } from '../../models'
// 🔌 HÀN ĐƯỜNG TRUYỀN CHUẨN: Kết nối sang thư mục helpers của create-race
import { getRaceLifecycleStatus } from '../../../create-race/helpers'

type PageState = {
    toastMessage?: string
}

const PAGE_SIZE = 20
export const useRaceCollection = (races: ListRacesResponse) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { toast } = useToast()
    const locationState = location.state as PageState | null
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (!locationState?.toastMessage) return
        toast({ title: 'Thông báo', description: locationState.toastMessage })
        navigate(location.pathname, { replace: true, state: {} })
    }, [location.pathname, locationState, navigate, toast])

    const totalItems = races.length
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)

    useEffect(() => {
        if (page !== safePage) setPage(safePage)
    }, [page, safePage])

    const visibleRows = useMemo(() => {
        const startIndex = (safePage - 1) * PAGE_SIZE
        const slicedRaces = races.slice(startIndex, startIndex + PAGE_SIZE)
        
        return slicedRaces.map((race) => ({
            ...race,
            status: getRaceLifecycleStatus(race.timeStart, race.timeEnd)
        }))
    }, [races, safePage])

    const startItem = totalItems === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
    const endItem = Math.min(totalItems, safePage * PAGE_SIZE)

    return {
        races: visibleRows, 
        page: safePage,
        totalPages,
        totalItems,
        startItem,
        endItem,
        setPage,
    }
}