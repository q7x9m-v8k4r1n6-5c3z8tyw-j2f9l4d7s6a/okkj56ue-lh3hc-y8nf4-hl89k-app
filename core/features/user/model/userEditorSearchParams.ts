export type UserEditorTarget = {
  category: 'team' | 'staff'
  mode: 'create' | 'edit'
  userId?: string
}

const keys = {
  category: 'category',
  mode: 'editor',
  userId: 'userId',
} as const

/** Parses the URL contract used by independent user management features. */
export const parseUserEditorTarget = (
  searchParams: URLSearchParams,
): UserEditorTarget | null => {
  const mode = searchParams.get(keys.mode)
  const category = searchParams.get(keys.category)
  const userIdValue = searchParams.get(keys.userId)
  const userId = userIdValue || undefined

  if (mode !== 'create' && mode !== 'edit') return null
  if (category !== 'team' && category !== 'staff') return null
  if (
    mode === 'edit'
    && !userId
  ) return null

  return { category, mode, userId }
}

/** Returns search params with the requested user editor target applied. */
export const setUserEditorTarget = (
  current: URLSearchParams,
  target: UserEditorTarget,
) => {
  const next = new URLSearchParams(current)
  next.set(keys.mode, target.mode)
  next.set(keys.category, target.category)
  if (target.userId) next.set(keys.userId, String(target.userId))
  else next.delete(keys.userId)
  return next
}

/** Returns search params with all user editor fields removed. */
export const clearUserEditorTarget = (current: URLSearchParams) => {
  const next = new URLSearchParams(current)
  next.delete(keys.mode)
  next.delete(keys.category)
  next.delete(keys.userId)
  return next
}
