import type { UserCategory } from '@/core/entities/user'

/** Query-key factory for create/edit-user server state. */
export const userFormQueryKeys = {
  detail: (category: UserCategory, userId: string) =>
    ['user-form', 'detail', category, userId] as const,
}
