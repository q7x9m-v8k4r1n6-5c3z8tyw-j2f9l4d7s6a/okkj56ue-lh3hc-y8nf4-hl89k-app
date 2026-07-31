import { z } from 'zod'

/** Account categories managed by the user workflows. */
export const userCategorySchema = z.enum(['team', 'staff'])

/** Canonical account availability statuses. */
export const userStatusSchema = z.enum(['active', 'inactive'])

/** Roles supported by staff accounts. */
export const staffRoleSchema = z.enum([
  'admin',
  'coordinator',
  'support',
])

/**
 * Canonical user summary rendered by reusable management UI.
 *
 * Password, invitation, note, and form mode are feature-specific and do not
 * belong in this entity model.
 */
export const userSummarySchema = z.object({
  id: z.string().min(1),
  category: userCategorySchema,
  displayName: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string().url().or(z.literal('')).nullable().optional(),
  status: userStatusSchema,
})

/**
 * Canonical user profile attached to the authenticated application session.
 *
 * Login tokens and refresh behavior stay in the auth feature; stable user
 * identity fields belong to the user entity.
 */
export const userProfileSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  roles: z.array(z.string().min(1)),
  userType: z.string().min(1).transform((value) => value.toLowerCase()),
  displayName: z.string().nullable(),
  avatarUrl: z.string().url().or(z.literal('')).nullable().optional(),
})

export type UserCategory = z.infer<typeof userCategorySchema>
export type UserStatus = z.infer<typeof userStatusSchema>
export type StaffRole = z.infer<typeof staffRoleSchema>
export type UserSummary = z.infer<typeof userSummarySchema>
export type UserProfile = z.infer<typeof userProfileSchema>
