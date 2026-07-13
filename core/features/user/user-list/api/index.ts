import { client } from '@/core/shared/api/interceptor'
import type { ListOrganizersByFilterRequest, ListTeamsByFilterRequest, ListTeamsResponse, OrganizerListResponse } from '../models'

export const getAllTeamsByFilter = async (payload: ListTeamsByFilterRequest = {}, signal?: AbortSignal): Promise<ListTeamsResponse> => {
    return client.request<ListTeamsResponse, ListTeamsByFilterRequest>({
        path: '/teams',
        method: 'GET',
        query: payload,
        signal,
    })
}

export const getAllOrganizersByFilter = async (payload: ListOrganizersByFilterRequest = {}, signal?: AbortSignal): Promise<OrganizerListResponse> => {
    return client.request<OrganizerListResponse, ListOrganizersByFilterRequest>({
        path: '/organizers',
        method: 'GET',
        query: payload,
        signal,
    })
}

export const deleteTeam = async (teamId: number, signal?: AbortSignal): Promise<void> => {
    return client.request<void>({
        path: `/teams/${teamId}`,
        method: 'DELETE',
        signal,
    })
}

export const deleteOrganizer = async (organizerId: number, signal?: AbortSignal): Promise<void> => {
    return client.request<void>({
        path: `/organizers/${organizerId}`,
        method: 'DELETE',
        signal,
    })
}
