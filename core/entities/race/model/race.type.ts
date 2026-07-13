import { z } from 'zod';
import { boothRaceModelSchema, organizerRaceModelSchema, raceModelSchema, teamRaceModelSchema } from './race.schema';

export type RaceModel = z.infer<typeof raceModelSchema>
export type OrganizerRaceModel = z.infer<typeof organizerRaceModelSchema>
export type TeamRaceModel = z.infer<typeof teamRaceModelSchema>
export type BoothRaceModel = z.infer<typeof boothRaceModelSchema>
