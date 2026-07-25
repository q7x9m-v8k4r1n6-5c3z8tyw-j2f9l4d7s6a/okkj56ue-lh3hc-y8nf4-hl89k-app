import { z } from 'zod'

export const organizerModelSchema = z.object({
    id: z.string().uuid(),
    displayName: z.string().min(1, 'Organizer name is required').optional(),
    email: z.string().email('Invalid email address'),
})

export const createOrganizerSchema = z.object({
    email: z.string().email('Email không hợp lệ').min(1, 'Vui lòng nhập email'),
    role: z.string().min(1, 'Vui lòng chọn vai trò'),
})