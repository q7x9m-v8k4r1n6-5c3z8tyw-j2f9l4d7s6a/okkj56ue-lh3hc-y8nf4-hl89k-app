import { z } from 'zod';
import { createRaceRequestSchema } from './createRace.schema';

export type CreateRaceRequest = z.infer<typeof createRaceRequestSchema>
