import { client } from '@/core/shared/api/interceptor'
import type { ListOrganizersByFilterRequest, ListTeamsByFilterRequest } from '../models'
import type { PagedResult } from '@core/shared'

export const getAllTeamsByFilter = async (payload: ListTeamsByFilterRequest = {}, signal?: AbortSignal): Promise<PagedResult<any>> => {
    return client.request<PagedResult<any>, ListTeamsByFilterRequest>({
        path: '/api/v1/Team',
        method: 'GET',
        query: payload, 
        signal,
    })
}

export const getAllOrganizersByFilter = async (payload: ListOrganizersByFilterRequest = {}, signal?: AbortSignal): Promise<PagedResult<any>> => {
    return client.request<PagedResult<any>, ListOrganizersByFilterRequest>({
        path: '/api/v1/Organizer',
        method: 'GET',
        query: payload,
        signal,
    })
}

export const deleteTeam = async (teamId: number, signal?: AbortSignal): Promise<void> => {
    return client.request<void>({
        path: `/api/v1/Team/${teamId}`,
        method: 'DELETE',
        signal,
    })
}

export const deleteOrganizer = async (organizerId: number, signal?: AbortSignal): Promise<void> => {
    return client.request<void>({
        path: `/api/v1/Organizer/${organizerId}`,
        method: 'DELETE',
        signal,
    })
}