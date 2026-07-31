import { describe, expect, it } from 'vitest'
import { createEmptyUserForm } from './userForm'
import {
  buildStaffIdentityFromEmail,
  prepareUserForm,
} from './userForm.validation'

describe('user form validation', () => {
  it('derives a readable staff identity from an email', () => {
    expect(buildStaffIdentityFromEmail('john.doe@example.com')).toEqual({
      username: 'john.doe',
      displayName: 'John Doe',
    })
  })

  it('prepares a create-organizer form without storing derived UI state', () => {
    const result = prepareUserForm('staff', 'create', {
      ...createEmptyUserForm(),
      email: 'john.doe@example.com',
      role: 'support',
    })

    expect(result.error).toBeUndefined()
    expect(result.form).toMatchObject({
      displayName: 'John Doe',
      username: 'john.doe',
      email: 'john.doe@example.com',
      role: 'support',
    })
  })

  it('leaves the team username empty for backend generation', () => {
    const result = prepareUserForm('team', 'create', {
      ...createEmptyUserForm(),
      displayName: 'Alpha',
      username: 'Alpha Team',
      email: 'leader@example.com',
    })
    expect(result.error).toBeUndefined()
    expect(result.form?.username).toBe('')
  })
})
