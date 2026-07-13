import type { z } from 'zod'
import {
  currentUserModelSchema,
  staffRoleSchema,
  userCategorySchema,
  userModelSchema,
  userRecordSchema,
  userStatusSchema,
  userTableRowModelSchema,
} from './user.schema'

export type UserCategory = z.infer<typeof userCategorySchema>
export type UserStatus = z.infer<typeof userStatusSchema>
export type StaffRole = z.infer<typeof staffRoleSchema>
export type User = z.infer<typeof userModelSchema>
export type CurrentUser = z.infer<typeof currentUserModelSchema>
export type UserRecord = z.infer<typeof userRecordSchema>
export type UserTableRowModel = z.infer<typeof userTableRowModelSchema>
