import { describe, expect, it } from 'vitest'
import {
  staffRoleSchema,
  userProfileSchema,
  userStatusSchema,
  userSummarySchema,
} from './user'

const validUser = {
  id: '9c1b6d4e-6e20-4c4c-a36c-f8a8e3d1e7a1',
  category: 'staff',
  displayName: 'Nguyen Van A',
  username: 'nguyenvana',
  email: 'user@example.com',
  status: 'active',
}

describe('user entity schemas', () => {
  it('accepts a canonical user summary', () => {
    expect(userSummarySchema.parse(validUser)).toEqual(validUser)
  })

  it('rejects an unsupported user status', () => {
    expect(() => userStatusSchema.parse('blocked')).toThrow()
  })

  it('keeps staff roles constrained to the domain values', () => {
    expect(staffRoleSchema.options).toEqual([
      'admin',
      'coordinator',
      'support',
    ])
  })

  it('accepts a canonical authenticated user profile', () => {
    expect(userProfileSchema.parse({
      id: 'user-id',
      email: 'user@example.com',
      role: 'admin',
      roles: ['admin'],
      userType: 'staff',
      displayName: 'Admin',
      avatarUrl: '',
    })).toMatchObject({ 
      id: 'user-id', 
      role: 'admin',
      roles: ['admin'], 
      userType: 'staff' 
    })
  })
})
