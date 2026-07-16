import { z } from 'zod';

export const createRaceRequestSchema = z.object({
    raceName: z.string().max(255, { message: 'Race name must be at most 255 characters long' }),
    place: z.string().max(255, { message: 'Place must be at most 255 characters long' }),
    
    timeStart: z.string().datetime({ message: 'Start time must be a valid datetime string' }),
    timeEnd: z.string().datetime({ message: 'End time must be a valid datetime string' }),
    isToggledLeaderboard: z.boolean(),
    isHiddenPoint: z.boolean(),
    coverUrl: z.string().url({ message: 'Cover URL must be a valid URL' }).max(500, { message: 'Cover URL must be at most 500 characters long' }).optional().or(z.literal('')),
    
    organizerId: z.array(z.string().uuid({ message: 'Organizer ID must be a valid UUID' })),
    
    raceTeam: z.array(z.object({
        teamID: z.string().uuid({ message: 'Team ID must be a valid UUID' }), // Chuẩn hóa chữ ID viết hoa nếu swagger bắt vậy
    })).optional(),
    
    booth: z.array(z.object({
        name: z.string().max(255, { message: 'Booth name must be at most 255 characters long' }),
        place: z.string().max(255, { message: 'Booth place must be at most 255 characters long' }),
        description: z.string().max(500, { message: 'Booth description must be at most 500 characters long' }).optional(),
        
        organizerID: z.string({ message: 'Organizer ID for booth must be a string' }), 
    })).optional(),
});

export type CreateRaceRequest = z.infer<typeof createRaceRequestSchema>;