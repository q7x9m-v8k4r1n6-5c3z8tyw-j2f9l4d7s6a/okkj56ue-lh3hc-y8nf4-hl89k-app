import type { UserCategory } from '@/core/entities/user'
import type { EditableUser, UserFormMode } from './userForm'

const sanitize = (value: unknown) => String(value ?? '').trim()

/** Derives organizer username and display name from a valid email local part. */
export const buildStaffIdentityFromEmail = (email: string) => {
  const localPart = sanitize(email).split('@')[0].toLowerCase()
  const username = localPart.replace(/[^a-z0-9._-]/g, '')
  const displayName = username
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b[a-z]/g, (character) => character.toUpperCase())

  return { username, displayName }
}

/** Validates a username according to the selected managed-account category. */
export const validateUserUsername = (
  category: UserCategory,
  username: string,
) => {
  if (category === 'team' && !/^[a-z0-9-]+$/.test(username)) {
    return 'Username đội chơi chỉ gồm chữ thường, số hoặc dấu gạch nối.'
  }
  if (category === 'staff' && !/^[a-z0-9._-]+$/.test(username)) {
    return 'Username thành viên chỉ gồm chữ thường, số, dấu chấm, gạch nối hoặc gạch dưới.'
  }
  return ''
}

/** Normalizes and validates the editable form before creating an API request. */
export const prepareUserForm = (
  category: UserCategory,
  mode: UserFormMode,
  form: EditableUser,
): { form?: EditableUser; error?: string } => {
  let displayName = form.displayName.trim()
  let username = form.username.trim()
  const email = form.email.trim()

  if (category === 'staff') {
    if (!email || (mode === 'create' && form.roleIds.length === 0) || (mode === 'edit' && !displayName)) {
      return {
        error: mode === 'edit'
          ? 'Vui lòng nhập đầy đủ tên hiển thị, email và vai trò.'
          : 'Vui lòng nhập đầy đủ email và vai trò.',
      }
    }
    if (mode === 'create') {
      const identity = buildStaffIdentityFromEmail(email)
      username = identity.username
      displayName = identity.displayName || 'Thành viên BTC'
      if (!username) {
        return {
          error: 'Email chưa hợp lệ để tạo tên đăng nhập cho Ban Tổ chức.',
        }
      }
    }
  }

  if (category === 'team' && (!displayName || !email)) {
    return { error: 'Vui lòng nhập đầy đủ tên hiển thị và email.' }
  }

  const usernameError = username && !(category === 'team' && mode === 'create')
    ? validateUserUsername(category, username)
    : ''
  if (usernameError) return { error: usernameError }

  return {
    form: {
      ...form,
      displayName,
      username: category === 'team' && mode === 'create' ? '' : username,
      email,
      role: form.role || 'coordinator',
    },
  }
}
