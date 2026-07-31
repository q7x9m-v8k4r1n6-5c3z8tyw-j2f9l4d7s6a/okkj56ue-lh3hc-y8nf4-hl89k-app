import type { ChangeEvent } from 'react'
import { LockIcon, SearchIcon } from '@/core/assets'
import { Button, Checkbox, Drawer, Input } from '@/core/shared'
import type { RoleResponse } from '../../model/securityRoles.contract'
import type { RoleForm, RoleFormErrors } from '../../model/securityRoles.form'
import type { PermissionGroup } from '../hooks/useSecurityRoleManagement'

type RoleEditorDrawerProps = {
  open: boolean
  role: RoleResponse | null
  form: RoleForm
  errors: RoleFormErrors
  groups: PermissionGroup[]
  permissionSearch: string
  permissionsLoading: boolean
  permissionsError: boolean
  saving: boolean
  onClose: () => void
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  onCodeChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onPermissionSearchChange: (value: string) => void
  onTogglePermission: (permissionId: string) => void
  onToggleModule: (group: PermissionGroup) => void
  onSubmit: () => void
}

/** Renders role identity and its permission matrix in a single drawer workflow. */
export const RoleEditorDrawer = ({
  errors,
  form,
  groups,
  onClose,
  onCodeChange,
  onDescriptionChange,
  onNameChange,
  onPermissionSearchChange,
  onSubmit,
  onToggleModule,
  onTogglePermission,
  open,
  permissionSearch,
  permissionsError,
  permissionsLoading,
  role,
  saving,
}: RoleEditorDrawerProps) => (
  <Drawer
    open={open}
    title={role ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
    icon={<LockIcon className="size-6" />}
    panelClassName="max-w-[680px]"
    onClose={onClose}
    footer={(
      <>
        <Button variant="secondary" disabled={saving} onClick={onClose}>Quay lại</Button>
        <Button disabled={saving} onClick={() => void onSubmit()}>
          {saving ? 'Đang lưu...' : role ? 'Lưu thay đổi' : 'Thêm vai trò'}
        </Button>
      </>
    )}
  >
    <div className="space-y-8">
      <section aria-labelledby="role-information-title">
        <div className="mb-5">
          <h3 id="role-information-title" className="text-base font-semibold text-[#1a1c1c]">Thông tin vai trò</h3>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Tên vai trò"
            requiredMark
            value={form.name}
            error={errors.name}
            placeholder="Ví dụ: Quản lý trận đấu"
            onChange={onNameChange}
          />
          <Input
            label="Mã vai trò"
            requiredMark
            value={form.code}
            error={errors.code}
            placeholder="Ví dụ: race.manager"
            onChange={onCodeChange}
          />
        </div>
        <label className="mt-5 block">
          <span className="mb-2 block text-xs font-semibold uppercase leading-[14px] tracking-[0.15px] text-[#1a1c1c]">Mô tả</span>
          <textarea
            value={form.description}
            maxLength={500}
            rows={3}
            className="w-full resize-none rounded-lg border border-[#e2e2e2] bg-white px-4 py-3 text-sm text-[#171717] outline-none transition placeholder:text-[#9ca3af] focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10"
            placeholder="Mô tả phạm vi trách nhiệm của vai trò"
            onChange={onDescriptionChange}
          />
          <span className="mt-1 block text-right text-xs text-[#9ca3af]">{form.description.length}/500</span>
        </label>
      </section>

      <section aria-labelledby="permission-title">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h3 id="permission-title" className="text-base font-semibold text-[#1a1c1c]">
              Phân quyền <span className="text-[#de3336]">(*)</span>
            </h3>
          </div>
          <span className="shrink-0 rounded-full bg-[#fff1f1] px-2.5 py-1 text-xs font-medium text-[#c82528]">
            Đã chọn {form.permissionIds.length}
          </span>
        </div>

        <label className="relative mb-4 block">
          <span className="sr-only">Tìm quyền</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#737373]" />
          <input
            value={permissionSearch}
            className="h-10 w-full rounded-lg border border-[#e2e2e2] bg-white pl-10 pr-3 text-sm outline-none placeholder:text-[#9ca3af] focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10"
            placeholder="Tìm theo tên, mã hoặc nhóm quyền..."
            onChange={(event) => onPermissionSearchChange(event.target.value)}
          />
        </label>

        {errors.permissions ? <p className="mb-3 text-xs text-[#de3336]">{errors.permissions}</p> : null}
        <div className="overflow-hidden rounded-xl border border-[#eeeeee]">
          {permissionsLoading ? (
            <p className="px-5 py-10 text-center text-sm text-[#9d9792]">Đang tải danh sách quyền...</p>
          ) : permissionsError ? (
            <p className="px-5 py-10 text-center text-sm text-[#b91c1c]">Không thể tải danh sách quyền.</p>
          ) : groups.length ? groups.map((group) => {
            const checkedCount = group.permissions.filter(({ id }) => form.permissionIds.includes(id)).length
            const allChecked = checkedCount === group.permissions.length
            return (
              <div key={group.module} className="border-b border-[#eeeeee] last:border-b-0">
                <div className="flex items-center justify-between bg-[#fafafa] px-4 py-3">
                  <Checkbox
                    checked={allChecked}
                    aria-label={`Chọn toàn bộ quyền ${group.module}`}
                    label={group.module}
                    onChange={() => onToggleModule(group)}
                  />
                  <span className="text-xs text-[#737373]">{checkedCount}/{group.permissions.length}</span>
                </div>
                <ul>
                  {group.permissions.map((permission) => (
                    <li key={permission.id} className="border-t border-[#f3f3f3] first:border-t-0">
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-[#fffafa]">
                        <Checkbox
                          checked={form.permissionIds.includes(permission.id)}
                          aria-label={`Chọn quyền ${permission.name}`}
                          onChange={() => onTogglePermission(permission.id)}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium text-[#262626]">{permission.name}</span>
                            <span className="rounded bg-[#f5f5f5] px-1.5 py-0.5 font-mono text-[10px] text-[#737373]">{permission.code}</span>
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[#737373]">
                            {permission.description || `Thao tác ${permission.action}`}
                          </span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }) : (
            <p className="px-5 py-10 text-center text-sm text-[#9d9792]">Không tìm thấy quyền phù hợp.</p>
          )}
        </div>
      </section>
    </div>
  </Drawer>
)
