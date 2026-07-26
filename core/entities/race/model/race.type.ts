import { z } from 'zod';
import {
    boothRaceModelSchema,
    organizerRaceModelSchema,
    raceBoothDetailSchema,
    raceDetailSchema,
    raceModelSchema,
    raceOrganizerDetailSchema,
    raceTeamDetailSchema,
    teamRaceModelSchema,
} from './race.schema';

export type RaceModel = z.infer<typeof raceModelSchema>
export type OrganizerRaceModel = z.infer<typeof organizerRaceModelSchema>
export type TeamRaceModel = z.infer<typeof teamRaceModelSchema>
export type BoothRaceModel = z.infer<typeof boothRaceModelSchema>
export type RaceTeamDetail = z.infer<typeof raceTeamDetailSchema>
export type RaceOrganizerDetail = z.infer<typeof raceOrganizerDetailSchema>
export type RaceBoothDetail = z.infer<typeof raceBoothDetailSchema>
export type RaceDetail = z.infer<typeof raceDetailSchema>
