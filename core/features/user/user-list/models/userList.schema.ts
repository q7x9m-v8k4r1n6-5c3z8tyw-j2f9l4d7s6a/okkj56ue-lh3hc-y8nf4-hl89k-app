import { z } from 'zod'

export const ListTeamsResponseSchema = z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().positive(),
    items: z.array(z.object({
        id: z.number(),
        name: z.string(),
        username: z.string(),
        status: z.enum(['active', 'inactive']),
        leaderEmail: z.string().email()
    }))
})

export const OrganizerListResponseSchema = z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalItems: z.number().int().nonnegative(),
    totalPages: z.number().int().positive(),
    items: z.array(z.object({
        id: z.number(),
        displayName: z.string(),
        email: z.string().email(),
        role: z.string(),
        status: z.enum(['active', 'inactive']),
    }))
})

export const ListTeamsByFilterRequestSchema = z.object({
    search: z.string().optional(),
    page: z.number().int().positive().optional(),
    pageSize: z.number().int().positive().optional(),
})

export const ListOrganizersByFilterRequestSchema = z.object({
    search: z.string().optional(),
    page: z.number().int().positive().optional(),
    pageSize: z.number().int().positive().optional(),
})