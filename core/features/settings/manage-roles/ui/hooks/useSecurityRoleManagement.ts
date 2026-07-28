import { useMemo, useState, type ChangeEvent } from 'react'
import { useToast } from '@/core/shared'
import type { PermissionResponse, RoleResponse } from '../../model/securityRoles.contract'
import {
  emptyRoleForm,
  mapRoleToForm,
  validateRoleForm,
  type RoleForm,
  type RoleFormErrors,
} from '../../model/securityRoles.form'
import {
  useDeactivateRoleMutation,
  useSaveRoleMutation,
} from '../../model/server/useSecurityRoleMutations'
import {
  usePermissionsQuery,
  useRolesQuery,
} from '../../model/server/useSecurityRolesQueries'

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return fallback
}

export type PermissionGroup = {
  module: string
  permissions: PermissionResponse[]
}

/** Coordinates RBAC list, role editor, permission selection and lifecycle drawers. */
export const useSecurityRoleManagement = () => {
  const rolesQuery = useRolesQuery()
  const permissionsQuery = usePermissionsQuery()
  const saveRole = useSaveRoleMutation()
  const deactivateRole = useDeactivateRoleMutation()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [permissionSearch, setPermissionSearch] = useState('')
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [form, setForm] = useState<RoleForm>(emptyRoleForm)
  const [errors, setErrors] = useState<RoleFormErrors>({})
  const [rolePendingDeactivation, setRolePendingDeactivation] = useState<RoleResponse | null>(null)

  const roles = useMemo(() => {
    const normalized = search.trim().toLocaleLowerCase('vi')
    if (!normalized) return rolesQuery.data ?? []
    return (rolesQuery.data ?? []).filter((role) => (
      [role.name, role.code, role.description]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase('vi').includes(normalized))
    ))
  }, [rolesQuery.data, search])

  const permissionGroups = useMemo(() => {
    const normalized = permissionSearch.trim().toLocaleLowerCase('vi')
    const filtered = (permissionsQuery.data ?? []).filter((permission) => (
      !normalized || [
        permission.name,
        permission.code,
        permission.description,
        permission.module,
        permission.action,
      ].filter(Boolean).some((value) => value?.toLocaleLowerCase('vi').includes(normalized))
    ))
    const groups = new Map<string, PermissionResponse[]>()
    filtered.forEach((permission) => {
      const module = permission.module.trim() || 'Khác'
      groups.set(module, [...(groups.get(module) ?? []), permission])
    })
    return [...groups.entries()].map(([module, permissions]) => ({ module, permissions }))
  }, [permissionSearch, permissionsQuery.data])

  const updateField = (field: 'name' | 'code' | 'description') => (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    if (field !== 'description') setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const closeEditor = () => {
    if (saveRole.isPending) return
    setEditorOpen(false)
    setErrors({})
    setPermissionSearch('')
  }

  const openCreate = () => {
    setEditingRole(null)
    setForm(emptyRoleForm())
    setErrors({})
    setPermissionSearch('')
    setEditorOpen(true)
  }

  const openEdit = (role: RoleResponse) => {
    if (role.isSystem) return
    setEditingRole(role)
    setForm(mapRoleToForm(role))
    setErrors({})
    setPermissionSearch('')
    setEditorOpen(true)
  }

  const togglePermission = (permissionId: string) => {
    setForm((current) => ({
      ...current,
      permissionIds: current.permissionIds.includes(permissionId)
        ? current.permissionIds.filter((id) => id !== permissionId)
        : [...current.permissionIds, permissionId],
    }))
    setErrors((current) => ({ ...current, permissions: undefined }))
  }

  const toggleModule = (group: PermissionGroup) => {
    const groupIds = group.permissions.map(({ id }) => id)
    const allSelected = groupIds.every((id) => form.permissionIds.includes(id))
    setForm((current) => ({
      ...current,
      permissionIds: allSelected
        ? current.permissionIds.filter((id) => !groupIds.includes(id))
        : [...new Set([...current.permissionIds, ...groupIds])],
    }))
    setErrors((current) => ({ ...current, permissions: undefined }))
  }

  const submit = async () => {
    const nextErrors = validateRoleForm(form)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    try {
      await saveRole.mutateAsync({
        roleId: editingRole?.id,
        form,
        originalPermissionIds: editingRole?.permissionIds ?? [],
      })
      toast({
        title: 'Thông báo',
        description: editingRole
          ? 'Đã cập nhật vai trò và danh sách quyền.'
          : 'Đã tạo vai trò mới.',
      })
      setEditorOpen(false)
    } catch (error) {
      toast({
        title: 'Không thể lưu vai trò',
        description: getErrorMessage(error, 'Vui lòng kiểm tra dữ liệu và thử lại.'),
        variant: 'danger',
      })
    }
  }

  const confirmDeactivate = async () => {
    if (!rolePendingDeactivation) return
    try {
      await deactivateRole.mutateAsync(rolePendingDeactivation.id)
      toast({
        title: 'Thông báo',
        description: `Đã ngừng hoạt động vai trò “${rolePendingDeactivation.name}”.`,
      })
      setRolePendingDeactivation(null)
    } catch (error) {
      toast({
        title: 'Không thể ngừng hoạt động vai trò',
        description: getErrorMessage(error, 'Vui lòng thử lại.'),
        variant: 'danger',
      })
    }
  }

  return {
    closeEditor,
    confirmDeactivate,
    deactivatePending: deactivateRole.isPending,
    editingRole,
    editorOpen,
    errors,
    form,
    isLoading: rolesQuery.isLoading,
    listError: rolesQuery.isError
      ? getErrorMessage(rolesQuery.error, 'Không thể tải danh sách vai trò.')
      : '',
    onCodeChange: updateField('code'),
    onDescriptionChange: updateField('description'),
    onNameChange: updateField('name'),
    openCreate,
    openEdit,
    permissionGroups,
    permissionSearch,
    permissionsError: permissionsQuery.isError,
    permissionsLoading: permissionsQuery.isLoading,
    rolePendingDeactivation,
    roles,
    saving: saveRole.isPending,
    search,
    selectedPermissionCount: form.permissionIds.length,
    setPermissionSearch,
    setRolePendingDeactivation,
    setSearch,
    submit,
    toggleModule,
    togglePermission,
    totalRoles: rolesQuery.data?.length ?? 0,
  }
}
