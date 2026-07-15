import { z } from 'zod'

export const teamModelSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1, 'Team name is required'),
    leaderEmail: z.string().email('Invalid email address'),
})

