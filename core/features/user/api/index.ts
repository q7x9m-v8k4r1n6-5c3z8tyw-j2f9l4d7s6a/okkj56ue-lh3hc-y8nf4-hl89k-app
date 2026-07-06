import type { UserProfile } from '../types'

export const getUserProfile = async (): Promise<UserProfile> => {
  return {
    id: 'mock-user-id',
    name: 'Move User',
  }
}
