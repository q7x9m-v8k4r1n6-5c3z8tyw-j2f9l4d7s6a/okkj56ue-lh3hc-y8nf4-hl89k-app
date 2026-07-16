import { z } from 'zod'
import type { organizerModelSchema } from './organizer.schema'

export type OrganizerModel = z.infer<typeof organizerModelSchema>
export type OrganizerSearchMode = 'single' | 'multiple'
