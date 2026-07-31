import { describe, expect, it } from 'vitest'
import { emptyRoleForm, validateRoleForm } from './securityRoles.form'

describe('validateRoleForm', () => {
  it('requires role identity and at least one permission', () => {
    expect(validateRoleForm(emptyRoleForm())).toEqual({
      name: 'Vui lòng nhập tên vai trò.',
      code: 'Vui lòng nhập mã vai trò.',
      permissions: 'Vui lòng chọn ít nhất một quyền.',
    })
  })

  it('accepts a stable RBAC code and selected permissions', () => {
    expect(validateRoleForm({
      name: 'Quản lý trận đấu',
      code: 'race.manager',
      description: '',
      permissionIds: ['1'],
    })).toEqual({})
  })
})

