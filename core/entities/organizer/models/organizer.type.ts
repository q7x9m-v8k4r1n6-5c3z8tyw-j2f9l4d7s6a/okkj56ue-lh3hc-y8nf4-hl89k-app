import { z } from 'zod'
import type { organizerModelSchema, createOrganizerSchema } from './organizer.schem'

export type OrganizerModel = z.infer<typeof organizerModelSchema>
export type OrganizerSearchMode = 'single' | 'multiple'

export type CreateOrganizerPayload = z.infer<typeof createOrganizerSchema>
