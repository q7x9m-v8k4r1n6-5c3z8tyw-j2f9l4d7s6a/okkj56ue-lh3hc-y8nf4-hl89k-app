// import { client } from '@/core/shared/api/interceptor'
import type { ListRacesRequestData, ListRacesResponse } from '@/core/features/race/list-race/models'

export const getAllListRaces = async (_payload: ListRacesRequestData = {}, _signal?: AbortSignal): Promise<ListRacesResponse> => {
    // return client.request<ListRacesResponse, ListRacesRequestData>({
    //     path: '/races',
    //     method: 'GET',
    //     query: payload,
    //     signal,
    // })

    return [
        {
            id: 'race-demo-1',
            name: 'MOVE 2026 - Vòng khởi động',
            place: 'Công viên Gia Định, TP.HCM',
            timeStart: '2026-08-15T07:00:00.000Z',
            timeEnd: '2026-08-15T11:30:00.000Z',
            status: 'upcoming',
        },
        {
            id: 'race-demo-2',
            name: 'MOVE Campus Challenge',
            place: 'Đại học Quốc gia TP.HCM',
            timeStart: '2026-09-05T06:30:00.000Z',
            timeEnd: '2026-09-05T12:00:00.000Z',
            status: 'draft',
        },
        {
            id: 'race-demo-3',
            name: 'MOVE Night Run',
            place: 'Phố đi bộ Nguyễn Huệ',
            timeStart: '2026-10-10T12:00:00.000Z',
            timeEnd: '2026-10-10T15:30:00.000Z',
            status: 'completed',
        },
    ]
}
