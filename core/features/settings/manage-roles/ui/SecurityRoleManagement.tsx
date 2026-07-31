import { EditIcon, PauseCircleIcon, PlusIcon, SearchIcon } from '@/core/assets'
import {
  Badge,
  Button,
  formatGmt7DateTime,
  IconButton,
  TableCard,
} from '@/core/shared'
import { DeactivateRoleDrawer } from './components/DeactivateRoleDrawer'
import { RoleEditorDrawer } from './components/RoleEditorDrawer'
import { useSecurityRoleManagement } from './hooks/useSecurityRoleManagement'

/** Renders the Settings Security workspace for role and permission management. */
export const SecurityRoleManagement = () => {
  const view = useSecurityRoleManagement()

  return (
    <section className="flex min-h-0 flex-1 flex-col px-6 pb-6">
      <div className="mb-5 flex flex-wrap items-end justify-end gap-4">
        <div className="flex items-center gap-2 mt-2">
          <label className="relative block w-[360px] max-w-[48vw]">
            <span className="sr-only">Tìm kiếm vai trò</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#737373]" />
            <input
              value={view.search}
              className="h-9 w-full rounded-lg border border-[#d4d4d4] bg-white pl-10 pr-3 text-sm text-[#525252] outline-none placeholder:text-[#9ca3af] focus:border-[#de3336] focus:ring-2 focus:ring-[#de3336]/10"
              placeholder="Tìm theo tên, mã vai trò..."
              onChange={(event) => view.setSearch(event.target.value)}
            />
          </label>
          <Button
            className="h-9 min-h-0"
            leadingIcon={<PlusIcon className="size-5" />}
            onClick={view.openCreate}
          >
            Thêm vai trò
          </Button>
        </div>
      </div>

      <TableCard className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="min-w-[1280px] w-full text-left">
            <thead className="sticky top-0 z-[1]">
              <tr className="h-11 bg-[#fafafa] text-xs font-medium leading-[18px] text-[#525252]">
                <th className="w-[240px] px-6 py-3">Tên vai trò</th>
                <th className="px-6 py-3">Mô tả</th>
                <th className="w-[140px] px-6 py-3">Loại</th>
                <th className="w-[130px] px-6 py-3">Số quyền</th>
                <th className="w-[190px] px-6 py-3">Ngày tạo</th>
                <th className="w-[190px] px-6 py-3">Chỉnh sửa gần nhất</th>
                <th className="w-[116px] px-4 py-3" />
              </tr>
            </thead>
            <tbody className="text-sm leading-5 text-[#525252]">
              {view.isLoading ? (
                <tr><td colSpan={7} className="border-t border-[#f3eeeb] px-6 py-12 text-center text-[#9d9792]">Đang tải danh sách vai trò...</td></tr>
              ) : view.listError ? (
                <tr><td colSpan={7} className="border-t border-[#f3eeeb] px-6 py-12 text-center text-[#b91c1c]">{view.listError}</td></tr>
              ) : view.roles.length ? view.roles.map((role) => (
                <tr key={role.id} className="h-[72px] border-t border-[#f3eeeb] hover:bg-[#fffafa]">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1a1c1c]">{role.name}</p>
                    <code className="mt-1 inline-block rounded bg-[#f5f5f5] px-2 py-0.5 text-[11px] text-[#737373]">{role.code}</code>
                  </td>
                  <td className="px-6 py-4 text-[#737373]">{role.description || 'Chưa có mô tả'}</td>
                  <td className="px-6 py-4"><Badge variant={role.isSystem ? 'primary' : 'neutral'}>{role.isSystem ? 'Hệ thống' : 'Tùy chỉnh'}</Badge></td>
                  <td className="px-6 py-4 font-medium text-[#1a1c1c]">{role.permissionCount}</td>
                  <td className="whitespace-nowrap px-6 py-4">{formatGmt7DateTime(role.createdAt)}</td>
                  <td className="whitespace-nowrap px-6 py-4">{formatGmt7DateTime(role.modifiedAt)}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <IconButton
                        icon={<EditIcon className="size-5" />}
                        aria-label={`Chỉnh sửa ${role.name}`}
                        title={role.isSystem ? 'Vai trò hệ thống không thể chỉnh sửa' : 'Chỉnh sửa'}
                        disabled={role.isSystem}
                        className="disabled:cursor-not-allowed disabled:opacity-35"
                        onClick={() => view.openEdit(role)}
                      />
                      <IconButton
                        icon={<PauseCircleIcon className="size-5" />}
                        aria-label={`Ngừng hoạt động ${role.name}`}
                        title={role.isSystem ? 'Vai trò hệ thống không thể ngừng hoạt động' : 'Ngừng hoạt động'}
                        disabled={role.isSystem}
                        className="text-[#de3336] hover:text-[#c82528] disabled:cursor-not-allowed disabled:opacity-35"
                        onClick={() => view.setRolePendingDeactivation(role)}
                      />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="border-t border-[#f3eeeb] px-6 py-12 text-center text-[#9d9792]">Không tìm thấy vai trò phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </TableCard>

      <RoleEditorDrawer
        open={view.editorOpen}
        role={view.editingRole}
        form={view.form}
        errors={view.errors}
        groups={view.permissionGroups}
        permissionSearch={view.permissionSearch}
        permissionsLoading={view.permissionsLoading}
        permissionsError={view.permissionsError}
        saving={view.saving}
        onClose={view.closeEditor}
        onNameChange={view.onNameChange}
        onCodeChange={view.onCodeChange}
        onDescriptionChange={view.onDescriptionChange}
        onPermissionSearchChange={view.setPermissionSearch}
        onTogglePermission={view.togglePermission}
        onToggleModule={view.toggleModule}
        onSubmit={view.submit}
      />
      <DeactivateRoleDrawer
        role={view.rolePendingDeactivation}
        pending={view.deactivatePending}
        onClose={() => view.setRolePendingDeactivation(null)}
        onConfirm={view.confirmDeactivate}
      />
    </section>
  )
}
