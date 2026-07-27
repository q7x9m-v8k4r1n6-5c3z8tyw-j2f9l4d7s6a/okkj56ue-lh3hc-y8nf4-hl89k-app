import { ChevronIcon, EditIcon } from '@/core/assets'
import { Button, Drawer } from '@/core/shared'
import type { StaffRole, UserStatus } from '@/core/entities/user'
import type { EditableUser, UserFormProps } from '../../model/userForm'
import { useUserForm } from '../hooks/useUserForm'
import { useUserFormView } from '../hooks/useUserFormView'

const USER_FORM_ID = 'user-form-panel'
const fieldClassName = 'block'
const labelClassName = 'mb-2 block text-sm font-bold uppercase leading-[14px] tracking-[0.35px] text-[#1a1c1c]'
const inputClassName = 'h-12 w-full rounded-lg border border-[#e5e5e5] bg-white px-[17px] py-[14.5px] text-base leading-normal text-[#6b7280] outline-none transition placeholder:text-[#6b7280] focus:border-[#d4d4d4] focus:ring-2 focus:ring-[#de3336]/10'
const disabledInputClassName = `${inputClassName} cursor-not-allowed bg-[#fafafa]`
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
    isSaving,
    resetPassword,
    returnToList,
    setDisplayName,
    setEmail,
    setRole,
    setStatus,
    setUsername,
    title,
    usernamePlaceholder,
  } = useUserForm(props, initialForm)

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

          {category !== 'staff' ? (
            <label className={fieldClassName}>
              <span className={labelClassName}>{mode === 'edit' ? 'Tên đăng nhập' : 'Username'}{mode === 'create' ? <RequiredMark /> : null}</span>
              <input value={form.username} onChange={(event) => setUsername(event.target.value)} type="text" required={mode === 'create'} disabled={mode === 'edit'} className={mode === 'edit' ? disabledInputClassName : inputClassName} placeholder={usernamePlaceholder} />
            </label>
          ) : null}

          <label className={fieldClassName}>
            <span className={labelClassName}>
              {category === 'staff' && mode === 'edit' ? 'Email' : emailLabel.replace(' (*)', '')}
              {!(category === 'staff' && mode === 'edit') ? <RequiredMark /> : null}
            </span>
            <input
              value={form.email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              disabled={mode === 'edit'}
              className={mode === 'edit' ? disabledInputClassName : inputClassName}
              placeholder={emailPlaceholder}
            />
          </label>

          {category === 'staff' ? (
            <label className={`${fieldClassName} relative`}>
              <span className={labelClassName}>Vai trò<RequiredMark /></span>
              <select value={form.role} required onChange={(event) => setRole(event.target.value as StaffRole)} className={selectClassName}>
                <option value="" disabled>Chọn vai trò</option>
                <option value="admin">Quản trị viên</option>
                <option value="coordinator">Điều phối viên</option>
                <option value="support">Hỗ trợ</option>
              </select>
              <ChevronIcon className="pointer-events-none absolute bottom-[18px] right-[17px] h-2 w-3 text-[#6b7280]" />
            </label>
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
            <Button type="button" size="sm" className="h-[37px] min-h-0 w-full px-8 py-0 text-sm font-semibold leading-[14px] tracking-[0.7px]" onClick={resetPassword}>
              Cấp lại mật khẩu mới
            </Button>
          </div>
        ) : null}
      </form>
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
