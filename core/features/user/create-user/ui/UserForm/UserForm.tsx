import { ChevronIcon, EditIcon } from '@/core/assets'
import { Button, Drawer } from '@/core/shared'
import type { StaffRole, UserStatus } from '@/core/entities/user/model'
import type { UserFormProps } from '../../models'
import { useUserForm } from './useUserForm'

const USER_FORM_ID = 'user-form-panel'
const fieldClassName = 'block'
const labelClassName = 'mb-2 block text-sm font-bold uppercase leading-[14px] tracking-[0.35px] text-[#1a1c1c]'
const inputClassName = 'h-12 w-full rounded-lg border border-[#e5e5e5] bg-white px-[17px] py-[14.5px] text-base leading-normal text-[#6b7280] outline-none transition placeholder:text-[#6b7280] focus:border-[#d4d4d4] focus:ring-2 focus:ring-[#de3336]/10'
const disabledInputClassName = `${inputClassName} cursor-not-allowed bg-[#fafafa]`
const selectClassName = `${inputClassName} appearance-none pr-11`

const RequiredMark = () => <span> (<span className="text-[#de3336]">*</span>)</span>

export const UserForm = ({ open = true, ...props }: UserFormProps) => {
  const { category, mode } = props
  const {
    displayName,
    displayNameLabel,
    displayNamePlaceholder,
    email,
    emailLabel,
    emailPlaceholder,
    error,
    existingRow,
    handleSubmit,
    hint,
    isLoadingExistingRow,
    resetPassword,
    returnToList,
    role,
    setDisplayName,
    setEmail,
    setRole,
    setStatus,
    setUsername,
    status,
    title,
    username,
    usernamePlaceholder,
  } = useUserForm(props)

  if (mode === 'edit' && isLoadingExistingRow) {
    return (
      <Drawer
        open={open}
        title="Đang tải dữ liệu"
        onClose={returnToList}
        icon={<EditIcon className="size-6 text-[#de3336]" />}
        footer={<Button variant="secondary" onClick={returnToList}>Hủy</Button>}
      >
        <p className="text-sm text-[#8b8580]">
          Đang tải thông tin người dùng...
        </p>
      </Drawer>
    )
  }

  if (mode === 'edit' && !existingRow) {
    return (
      <Drawer
        open={open}
        title="Không tìm thấy dữ liệu"
        onClose={returnToList}
        icon={<EditIcon className="size-6 text-[#de3336]" />}
        footer={<Button variant="secondary" onClick={returnToList}>Quay lại</Button>}
      >
        <p className="text-sm text-[#8b8580]">
          Người dùng cần chỉnh sửa không còn tồn tại hoặc đường dẫn không hợp lệ.
        </p>
      </Drawer>
    )
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
          <Button type="submit" size="sm" className="h-[37px] min-h-0 px-8 py-0 text-sm font-semibold leading-[14px] tracking-[0.7px]" form={USER_FORM_ID}>Lưu</Button>
        </>
      )}
    >
      <form id={USER_FORM_ID} className="flex min-h-full flex-col" onSubmit={handleSubmit}>
        <div className="space-y-8">
          {!(category === 'staff' && mode === 'create') ? (
            <label className={fieldClassName}>
              <span className={labelClassName}>{displayNameLabel.replace(' (*)', '')}<RequiredMark /></span>
              <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} type="text" required className={inputClassName} placeholder={displayNamePlaceholder} />
            </label>
          ) : null}

          {category !== 'staff' ? (
            <label className={fieldClassName}>
              <span className={labelClassName}>{mode === 'edit' ? 'Tên đăng nhập' : 'Username'}{mode === 'create' ? <RequiredMark /> : null}</span>
              <input value={username} onChange={(event) => setUsername(event.target.value)} type="text" required={mode === 'create'} disabled={mode === 'edit'} className={mode === 'edit' ? disabledInputClassName : inputClassName} placeholder={usernamePlaceholder} />
            </label>
          ) : null}

          <label className={fieldClassName}>
            <span className={labelClassName}>
              {category === 'staff' && mode === 'edit' ? 'Email' : emailLabel.replace(' (*)', '')}
              {!(category === 'staff' && mode === 'edit') ? <RequiredMark /> : null}
            </span>
            <input
              value={email}
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
              <select value={role} required onChange={(event) => setRole(event.target.value as StaffRole)} className={selectClassName}>
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
              <select value={status} onChange={(event) => setStatus(event.target.value as UserStatus)} className={selectClassName}>
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
