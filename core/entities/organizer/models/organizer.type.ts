import { z } from 'zod'
import type { organizerModelSchema } from './organizer.schem'

export type OrganizerModel = z.infer<typeof organizerModelSchema>
export type OrganizerSearchMode = 'single' | 'multiple'
