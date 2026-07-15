import { z } from 'zod';

export const createRaceRequestSchema = z.object({
    raceName: z.string().max(255, { message: 'Race name must be at most 255 characters long' }),
    place: z.string().max(255, { message: 'Place must be at most 255 characters long' }),
    startTime: z.string().datetime({ message: 'Start time must be a valid datetime string' }),
    endTime: z.string().datetime({ message: 'End time must be a valid datetime string' }),
    coverUrl: z.string().url({ message: 'Cover URL must be a valid URL' }).max(500, { message: 'Cover URL must be at most 500 characters long' }).optional(),
    organizerId: z.string().uuid({ message: 'Organizer ID must be a valid UUID' }),
    raceTeams: z.array(z.object({
        teamId: z.string().uuid({ message: 'Team ID must be a valid UUID' }),
    })).optional(),
    raceBooths: z.array(z.object({
        boothId: z.string().uuid({ message: 'Booth ID must be a valid UUID' }),
        name: z.string().max(255, { message: 'Booth name must be at most 255 characters long' }),
        location: z.string().max(255, { message: 'Booth location must be at most 255 characters long' }),
        description: z.string().max(500, { message: 'Booth description must be at most 500 characters long' }).optional(),
        managerIds: z.array(z.string().uuid({ message: 'Manager ID must be a valid UUID' })).optional(),
    })).optional(),
});