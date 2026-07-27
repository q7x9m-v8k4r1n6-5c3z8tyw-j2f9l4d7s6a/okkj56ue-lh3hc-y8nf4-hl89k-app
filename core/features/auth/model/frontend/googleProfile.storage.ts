import type { UserProfile } from '@/core/entities/user'

const GOOGLE_PROFILE_STORAGE_KEY = 'move.google-profile'

export type GoogleProfile =
  Pick<UserProfile, 'email' | 'displayName' | 'avatarUrl'>

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

/** Decodes the small public profile subset carried by a Google credential. */
export const getGoogleProfileFromCredential = (credential: string): GoogleProfile | null => {
  try {
    const payloadPart = credential.split('.')[1]
    if (!payloadPart) return null

    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const bytes = Uint8Array.from(atob(paddedBase64), (character) => character.charCodeAt(0))
    const payload: unknown = JSON.parse(new TextDecoder().decode(bytes))

    if (!isRecord(payload) || typeof payload.email !== 'string') return null

    return {
      email: payload.email,
      displayName: typeof payload.name === 'string' ? payload.name : null,
      avatarUrl: typeof payload.picture === 'string' ? payload.picture : null,
    }
  } catch {
    return null
  }
}

/** Saves the optional Google avatar/name for the current browser session. */
export const saveGoogleProfile = (profile: GoogleProfile) => {
  sessionStorage.setItem(GOOGLE_PROFILE_STORAGE_KEY, JSON.stringify(profile))
}

/** Restores Google-only profile fields after refreshing the backend session. */
export const restoreGoogleProfile = (user: UserProfile): UserProfile => {
  try {
    const stored: unknown = JSON.parse(sessionStorage.getItem(GOOGLE_PROFILE_STORAGE_KEY) ?? 'null')
    if (!isRecord(stored) || stored.email !== user.email) return user

    return {
      ...user,
      displayName: user.displayName?.trim()
        || (typeof stored.displayName === 'string' ? stored.displayName : user.displayName),
      avatarUrl: typeof stored.avatarUrl === 'string' ? stored.avatarUrl : user.avatarUrl,
    }
  } catch {
    return user
  }
}

/** Removes the cached Google profile when the user signs out. */
export const clearGoogleProfile = () => {
  sessionStorage.removeItem(GOOGLE_PROFILE_STORAGE_KEY)
}
