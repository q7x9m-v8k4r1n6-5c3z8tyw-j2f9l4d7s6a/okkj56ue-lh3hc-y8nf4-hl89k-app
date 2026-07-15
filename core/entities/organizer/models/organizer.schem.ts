import { z } from 'zod'

export const organizerModelSchema = z.object({
    id: z.string().uuid(),
    displayName: z.string().min(1, 'Organizer name is required').optional(),
    email: z.string().email('Invalid email address'),
})