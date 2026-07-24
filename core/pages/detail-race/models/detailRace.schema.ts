import { z } from 'zod'

export const detailRaceTabSchema = z.enum(['basic', 'live', 'cards', 'secret', 'history', 'message'])
