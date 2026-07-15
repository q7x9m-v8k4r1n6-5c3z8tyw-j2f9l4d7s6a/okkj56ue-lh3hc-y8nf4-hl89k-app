import { z } from 'zod';

export const raceModelSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(255).optional(),
    place: z.string().max(255).optional(),
    timeStart: z.string().datetime().optional(),
    timeEnd: z.string().datetime().optional(),
    coverUrl: z.string().url().max(500).optional(),
    status: z.enum(['draft', 'upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
    createdAt: z.string().datetime().optional(),
    createdBy: z.string().uuid().optional(),
    modifiedAt: z.string().datetime().optional(),
    modifiedBy: z.string().uuid().optional(),
});

export const teamRaceModelSchema = raceModelSchema.extend({
    teamId: z.string().uuid(),
    raceId: z.string().uuid(),
});

export const organizerRaceModelSchema = raceModelSchema.extend({
    organizerId: z.string().uuid(),
    raceId: z.string().uuid(),
});

export const boothRaceModelSchema = raceModelSchema.extend({
    boothId: z.string().uuid(),
    name: z.string().max(255),
    location: z.string().max(255),
    description: z.string().max(500).optional(),
    managerIds: z.array(z.string().uuid()).optional(),
    raceId: z.string().uuid(),
});