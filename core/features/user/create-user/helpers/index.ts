import type { UserCategory } from '@/core/entities/user/model'

export const DEFAULT_USER_PASSWORD = 'Mymycute'

const sanitize = (value: unknown) => String(value ?? '').trim()

export const buildStaffIdentityFromEmail = (email: string) => {
  const localPart = sanitize(email).split('@')[0].toLowerCase()
  const username = localPart.replace(/[^a-z0-9._-]/g, '')
  const displayName = username
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b[a-z]/g, (character) => character.toUpperCase())

  return {
    username,
    displayName,
  }
}

export const validateUserUsername = (category: UserCategory, username: string) => {
  if (category === 'team' && !/^[a-z0-9-]+$/.test(username)) {
    return 'Username đội chơi chỉ gồm chữ thường, số hoặc dấu gạch nối.'
  }

  if (category === 'staff' && !/^[a-z0-9._-]+$/.test(username)) {
    return 'Username thành viên chỉ gồm chữ thường, số, dấu chấm, gạch nối hoặc gạch dưới.'
  }

  return ''
}
