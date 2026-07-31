import type { RoleResponse } from './securityRoles.contract'

export type RoleForm = {
  name: string
  code: string
  description: string
  permissionIds: string[]
}

export type RoleFormErrors = Partial<Record<'name' | 'code' | 'permissions', string>>

export const emptyRoleForm = (): RoleForm => ({
  name: '',
  code: '',
  description: '',
  permissionIds: [],
})

/** Maps a validated role response into editable browser state. */
export const mapRoleToForm = (role: RoleResponse): RoleForm => ({
  name: role.name,
  code: role.code,
  description: role.description ?? '',
  permissionIds: [...role.permissionIds],
})

/** Validates the role fields and the least-privilege permission selection. */
export const validateRoleForm = (form: RoleForm): RoleFormErrors => {
  const errors: RoleFormErrors = {}
  if (!form.name.trim()) errors.name = 'Vui lòng nhập tên vai trò.'
  else if (form.name.trim().length > 100) errors.name = 'Tên vai trò không được vượt quá 100 ký tự.'

  if (!form.code.trim()) errors.code = 'Vui lòng nhập mã vai trò.'
  else if (!/^[a-zA-Z0-9._:-]+$/.test(form.code.trim())) {
    errors.code = 'Mã chỉ gồm chữ, số và các ký tự . _ : -'
  } else if (form.code.trim().length > 100) errors.code = 'Mã vai trò không được vượt quá 100 ký tự.'

  if (!form.permissionIds.length) errors.permissions = 'Vui lòng chọn ít nhất một quyền.'
  return errors
}

