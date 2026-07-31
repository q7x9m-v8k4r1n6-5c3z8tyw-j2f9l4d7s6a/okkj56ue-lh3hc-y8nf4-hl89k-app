import { ChevronIcon, EditIcon } from '@/core/assets'
import { Button, Drawer, client } from '@/core/shared'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { UserStatus } from '@/core/entities/user'
import type { EditableUser, UserFormProps } from '../../model/userForm'
import { useUserForm } from '../hooks/useUserForm'
import { useUserFormView } from '../hooks/useUserFormView'

const USER_FORM_ID = 'user-form-panel'
const fieldClassName = 'block'
const labelClassName = 'mb-2 block text-sm font-bold uppercase leading-[14px] tracking-[0.35px] text-[#1a1c1c]'
const inputClassName = 'h-12 w-full rounded-lg border border-[#e5e5e5] bg-white px-[17px] py-[14.5px] text-base leading-normal text-[#6b7280] outline-none transition placeholder:text-[#6b7280] focus:border-[#d4d4d4] focus:ring-2 focus:ring-[#de3336]/10'
const disabledInputClassName = `${inputClassName} cursor-not-allowed !bg-[#e5e7eb] text-[#737373] hover:!bg-[#e5e7eb]`
const selectClassName = `${inputClassName} appearance-none pr-11`

const RequiredMark = () => <span> (<span className="text-[#de3336]">*</span>)</span>

type UserFormEditorProps = UserFormProps & {
  initialForm?: EditableUser
}

const UserFormEditor = ({
  initialForm,
  open = true,
  ...props
}: UserFormEditorProps) => {
  const { category, mode } = props
  const {
    displayNameLabel,
    displayNamePlaceholder,
    emailLabel,
    emailPlaceholder,
    error,
    form,
    handleSubmit,
    hint,
    isResettingPassword,
    isSaving,
    resetPassword,
    returnToList,
    setDisplayName,
    setEmail,
    setRoleIds,
    setStatus,
    setUsername,
    title,
    usernamePlaceholder,
  } = useUserForm(props, initialForm)
  const [rolePanelOpen, setRolePanelOpen] = useState(false)
  const [pendingRoleIds, setPendingRoleIds] = useState<string[]>(form.roleIds)
  const rolesQuery = useQuery({
    queryKey: ['rbac', 'roles'],
    queryFn: () => client.request<Array<{ id: string; name: string; code: string; description?: string | null }>>({
      path: '/admin/organizers/roles',
    }),
    enabled: category === 'staff',
  })
  const selectedRoles = (rolesQuery.data ?? []).filter((role) => form.roleIds.includes(role.id))
  const openRolePanel = () => {
    setPendingRoleIds(form.roleIds)
    setRolePanelOpen(true)
  }

  return (
    <Drawer
      open={open}
      title={title}
      onClose={returnToList}
      icon={<EditIcon className="size-6 shrink-0 text-[#de3336]" />}
      footer={(
        <>
          <Button type="button" variant="secondary" size="sm" className="h-[37px] min-h-0 px-[33px] py-0 text-sm font-semibold leading-[14px] tracking-[0.7px]" onClick={returnToList}>Hủy</Button>
          <Button disabled={isSaving} type="submit" size="sm" className="h-[37px] min-h-0 px-8 py-0 text-sm font-semibold leading-[14px] tracking-[0.7px]" form={USER_FORM_ID}>Lưu</Button>
        </>
      )}
    >
      <form id={USER_FORM_ID} className="flex min-h-full flex-col" onSubmit={handleSubmit}>
        <div className="space-y-8">
          {!(category === 'staff' && mode === 'create') ? (
            <label className={fieldClassName}>
              <span className={labelClassName}>{displayNameLabel.replace(' (*)', '')}<RequiredMark /></span>
              <input value={form.displayName} onChange={(event) => setDisplayName(event.target.value)} type="text" required className={inputClassName} placeholder={displayNamePlaceholder} />
            </label>
          ) : null}

          {category !== 'staff' && mode === 'edit' ? (
            <label className={fieldClassName}>
              <span className={labelClassName}>Tên đăng nhập<RequiredMark /></span>
              <input value={form.username} onChange={(event) => setUsername(event.target.value)} type="text" required className={inputClassName} placeholder={usernamePlaceholder} />
            </label>
          ) : null}

          <label className={`${fieldClassName} ${category === 'staff' && mode === 'edit' ? 'cursor-not-allowed' : ''}`}>
            <span className={labelClassName}>
              {category === 'staff' && mode === 'edit' ? 'Email' : emailLabel.replace(' (*)', '')}
              {!(category === 'staff' && mode === 'edit') ? <RequiredMark /> : null}
            </span>
            <input
              value={form.email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              disabled={category === 'staff' && mode === 'edit'}
              className={category === 'staff' && mode === 'edit' ? disabledInputClassName : inputClassName}
              placeholder={emailPlaceholder}
            />
          </label>

          {category === 'staff' ? (
            <div className={fieldClassName}>
              <span className={labelClassName}>Vai trò<RequiredMark /></span>
              {selectedRoles.length ? (
                <div className="flex min-h-12 items-center gap-2 overflow-hidden rounded-lg border border-[#e5e5e5] bg-white px-4">
                  <span className="min-w-0 flex-1 truncate text-sm text-[#1a1c1c]" title={selectedRoles.map((role) => role.name).join(', ')}>
                    {selectedRoles.map((role) => role.name).join(', ')}
                  </span>
                  <button type="button" className="shrink-0 text-sm font-semibold text-[#de3336]" onClick={openRolePanel}>Chỉnh sửa</button>
                </div>
              ) : (
                <>
                  <button type="button" className="flex h-12 w-full items-center justify-center rounded-lg border border-dashed border-[#d4d4d4] text-sm font-semibold text-[#de3336] hover:bg-[#fff5f5]" onClick={openRolePanel}>
                    + Thêm vai trò
                  </button>
                  {rolesQuery.isError ? <p className="mt-2 text-xs text-[#b43b35]">Không tải được danh sách vai trò. Vui lòng khởi động lại backend và thử lại.</p> : null}
                </>
              )}
            </div>
          ) : null}

          {mode === 'edit' ? (
            <label className={`${fieldClassName} relative`}>
              <span className={labelClassName}>Trạng thái<RequiredMark /></span>
              <select value={form.status} onChange={(event) => setStatus(event.target.value as UserStatus)} className={selectClassName}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <ChevronIcon className="pointer-events-none absolute bottom-[18px] right-[17px] h-2 w-3 text-[#6b7280]" />
            </label>
          ) : null}

          {hint ? <p className="rounded-xl border border-[#f0e7d7] bg-[#fff9eb] px-4 py-3 text-sm text-[#8a6b21]">{hint}</p> : null}
          {error ? <p className="rounded-xl border border-[#f3d7d5] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#b43b35]">{error}</p> : null}
        </div>
        {mode === 'edit' && category !== 'staff' ? (
          <div className="mt-auto pt-8">
            <Button disabled={isResettingPassword} type="button" size="sm" className="h-[37px] min-h-0 w-full px-8 py-0 text-sm font-semibold leading-[14px] tracking-[0.7px]" onClick={() => void resetPassword()}>
              {isResettingPassword ? 'Đang cấp lại mật khẩu...' : 'Cấp lại mật khẩu mới'}
            </Button>
          </div>
        ) : null}
      </form>
      <Drawer
        open={rolePanelOpen}
        title="Thêm vai trò"
        onClose={() => setRolePanelOpen(false)}
        layerClassName="z-[60]"
        panelClassName="max-w-[430px]"
        footer={(
          <>
            <Button variant="secondary" onClick={() => setRolePanelOpen(false)}>Quay lui</Button>
            <Button onClick={() => { setRoleIds(pendingRoleIds); setRolePanelOpen(false) }}>Thêm</Button>
          </>
        )}
      >
        <div className="border-y border-[#eeeeee]">
          {rolesQuery.isLoading ? <p className="py-6 text-center text-sm text-[#737373]">Đang tải vai trò...</p> : null}
          {rolesQuery.data?.map((role) => (
            <label key={role.id} className="flex cursor-pointer items-start gap-3 border-b border-[#eeeeee] px-1 py-4 last:border-b-0 hover:bg-[#fafafa]">
              <input
                type="checkbox"
                className="mt-0.5 size-4 rounded border-[#bdbdbd] accent-[#de3336]"
                checked={pendingRoleIds.includes(role.id)}
                onChange={() => setPendingRoleIds((current) => current.includes(role.id) ? current.filter((id) => id !== role.id) : [...current, role.id])}
              />
              <span className="min-w-0"><span className="block text-sm font-semibold text-[#1a1c1c]">{role.name}</span><span className="mt-1 block text-xs leading-5 text-[#737373]">{role.description || 'Chưa có mô tả cho vai trò này.'}</span></span>
            </label>
          ))}
          {rolesQuery.isError ? <p className="py-6 text-center text-sm text-[#b43b35]">Không thể tải danh sách vai trò.</p> : null}
        </div>
      </Drawer>
    </Drawer>
  )
}

/** Public create/edit user panel with server initialization isolated in a hook. */
export const UserForm = ({ open = true, ...props }: UserFormProps) => {
  const { close, initialForm, isLoading, isMissing } = useUserFormView(props)

  if (props.mode === 'edit' && (isLoading || isMissing)) {
    return (
      <Drawer
        open={open}
        title={isLoading ? 'Đang tải dữ liệu' : 'Không tìm thấy dữ liệu'}
        onClose={close}
        icon={<EditIcon className="size-6 text-[#de3336]" />}
        footer={(
          <Button variant="secondary" onClick={close}>
            {isLoading ? 'Hủy' : 'Quay lại'}
          </Button>
        )}
      >
        <p className="text-sm text-[#8b8580]">
          {isLoading
            ? 'Đang tải thông tin người dùng...'
            : 'Người dùng cần chỉnh sửa không còn tồn tại hoặc đường dẫn không hợp lệ.'}
        </p>
      </Drawer>
    )
  }

  return (
    <UserFormEditor
      key={`${props.category}-${props.mode}-${initialForm?.id ?? 'new'}`}
      {...props}
      initialForm={initialForm}
      open={open}
    />
  )
}
