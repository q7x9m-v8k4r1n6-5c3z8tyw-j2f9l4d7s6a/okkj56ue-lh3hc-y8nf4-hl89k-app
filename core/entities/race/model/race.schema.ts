import { z } from 'zod';

export const raceModelSchema = z.object({
    id: z.string().uuid(),
    name: z.string().max(255).optional(),
    place: z.string().max(255).optional(),
    timeStart: z.string().optional(),
    timeEnd: z.string().optional(),
    coverUrl: z.string().url().max(500).nullable().optional(),
    status: z.enum(['draft', 'ready', 'ongoing', 'paused', 'completed']).optional(),
    createdAt: z.string().optional(),
    createdBy: z.string().uuid().optional(),
    modifiedAt: z.string().optional(),
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

export const raceTeamDetailSchema = z.object({
    id: z.string().optional(),
    teamID: z.string().optional(),
    teamId: z.string().optional(),
    name: z.string().optional(),
    leaderEmail: z.string().optional(),
    team: z.object({
        id: z.string(),
        name: z.string(),
        leaderEmail: z.string(),
    }).optional(),
});

export const raceOrganizerDetailSchema = z.object({
    id: z.string(),
    displayName: z.string().optional(),
    email: z.string(),
});

export const raceBoothDetailSchema = z.object({
    id: z.string().optional(),
    boothId: z.string().optional(),
    name: z.string().optional(),
    place: z.string().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
    organizerID: z.string().optional(),
    organizerId: z.string().optional(),
    managerId: z.string().optional(),
    managerIds: z.array(z.string()).optional(),
    managers: z.array(raceOrganizerDetailSchema).optional(),
});

export const raceDetailSchema = raceModelSchema.extend({
    raceName: z.string().optional(),
    modifiedAtUtc: z.string().optional(),
    updatedAt: z.string().optional(),
    isToggledLeaderboard: z.boolean().optional(),
    isHiddenPoint: z.boolean().optional(),
    organizerId: z.array(z.string()).optional(),
    raceTeam: z.array(raceTeamDetailSchema).optional(),
    booth: z.array(raceBoothDetailSchema).optional(),
});
