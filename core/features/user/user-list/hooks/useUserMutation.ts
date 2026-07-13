import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import type { UserCategory, UserTableRowModel } from '@/core/entities/user/model'
import { userQueryKey } from '../../constants'
import type { ListOrganizersByFilterRequest, ListTeamsByFilterRequest } from '../models'
import { deleteOrganizer, deleteTeam, getAllOrganizersByFilter, getAllTeamsByFilter } from '../api'

export const useTeamMutation = (payload: ListTeamsByFilterRequest = {}) => {
    return useQuery({
        queryKey: [...userQueryKey, 'teams', payload],
        queryFn: ({ signal }) => getAllTeamsByFilter(payload, signal),
    })
}

export const useOrganizerMutation = (payload: ListOrganizersByFilterRequest = {}) => {
    return useQuery({
        queryKey: [...userQueryKey, 'organizers', payload],
        queryFn: ({ signal }) => getAllOrganizersByFilter(payload, signal),
    })
}

type UseUserMutationParams = {
    tab: UserCategory
    payload: ListTeamsByFilterRequest | ListOrganizersByFilterRequest
}

export const useUserMutation = ({ payload, tab }: UseUserMutationParams) => {
    const queryClient = useQueryClient()
    const teamsQuery = useTeamMutation(payload)
    const organizersQuery = useOrganizerMutation(payload)
    const activeQuery = tab === 'team' ? teamsQuery : organizersQuery

    const visibleRows = useMemo(() => {
        if (tab === 'team') {
            return (teamsQuery.data?.items ?? []).map<UserTableRowModel>((row) => ({
                id: row.id,
                category: 'team' as const,
                displayName: row.name,
                username: row.username,
                status: row.status,
                email: row.leaderEmail,
            }))
        }

        return (organizersQuery.data?.items ?? []).map<UserTableRowModel>((row) => ({
            id: row.id,
            category: 'staff' as const,
            displayName: row.displayName,
            username: row.email.split('@')[0] ?? '',
            status: row.status,
            email: row.email,
        }))
    }, [organizersQuery.data?.items, tab, teamsQuery.data?.items])

    const deleteUser = async (category: UserCategory, userId: number) => {
        if (category === 'team') {
            await deleteTeam(userId)
        } else {
            await deleteOrganizer(userId)
        }

        void queryClient.invalidateQueries({ queryKey: userQueryKey })
        return true
    }

    const refreshUsers = () => {
        void queryClient.invalidateQueries({ queryKey: userQueryKey })
    }

    return {
        counts: {
            team: teamsQuery.data?.totalItems ?? 0,
            staff: organizersQuery.data?.totalItems ?? 0,
        },
        deleteUser,
        error: activeQuery.error,
        isError: activeQuery.isError,
        isLoading: activeQuery.isLoading,
        refreshUsers,
        totalPages: activeQuery.data?.totalPages ?? 1,
        visibleRows,
    }
}
