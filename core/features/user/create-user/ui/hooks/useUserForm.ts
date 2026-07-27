import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { StaffRole, UserStatus } from '@/core/entities/user'
import { useToast } from '@/core/shared'
import {
  createEmptyUserForm,
  DEFAULT_USER_PASSWORD,
  type EditableUser,
  type UserFormProps,
} from '../../model/userForm'
import { prepareUserForm } from '../../model/userForm.validation'
import { useSaveUserMutation } from '../../model/server/useSaveUserMutation'

const getLabel = (category: UserFormProps['category']) =>
  category === 'staff' ? 'thành viên' : 'đội chơi'

/** Owns browser form state and coordinates a validated save mutation. */
export const useUserForm = (
  props: UserFormProps,
  initialForm?: EditableUser,
) => {
  const { category, mode, onClose, onSaved } = props
  const navigate = useNavigate()
  const { toast } = useToast()
  const saveUser = useSaveUserMutation()
  const [form, setForm] = useState<EditableUser>(
    initialForm ?? createEmptyUserForm,
  )
  const [hint, setHint] = useState('')
  const [validationError, setValidationError] = useState('')

  const updateForm = <Key extends keyof EditableUser>(
    field: Key,
    value: EditableUser[Key],
  ) => {
    setForm((current) => ({ ...current, [field]: value }))
    setValidationError('')
  }

  const returnToList = () => {
    if (onClose) return onClose()
    navigate('/users', { state: { activeTab: category } })
  }

  const resetPassword = () => {
    updateForm('password', DEFAULT_USER_PASSWORD)
    setHint(
      `Mật khẩu sẽ được đặt lại về ${DEFAULT_USER_PASSWORD} sau khi bạn nhấn Lưu.`,
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const prepared = prepareUserForm(category, mode, form)
    if (!prepared.form) {
      setValidationError(prepared.error ?? 'Dữ liệu chưa hợp lệ.')
      return
    }

    try {
      await saveUser.mutateAsync({ category, mode, form: prepared.form })
      const toastMessage = mode === 'edit'
        ? `Đã cập nhật ${getLabel(category)}.`
        : `Đã tạo ${getLabel(category)} mới.`

      if (onSaved) {
        toast({ title: 'Thông báo', description: toastMessage })
        onSaved()
        return
      }
      navigate('/users', {
        state: { activeTab: category, toastMessage },
      })
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : 'Không thể lưu người dùng.',
      )
    }
  }

  const title = category === 'staff'
    ? mode === 'edit' ? 'Chỉnh sửa Ban Tổ chức' : 'Thêm mới Ban Tổ chức'
    : mode === 'edit' ? 'Chỉnh sửa đội chơi' : 'Thêm đội chơi mới'

  return {
    displayNameLabel: category === 'staff'
      ? mode === 'edit' ? 'Tên hiển thị (*)' : 'Họ và tên'
      : 'Tên đội chơi (*)',
    displayNamePlaceholder: category === 'staff'
      ? 'Nguyen Van A'
      : mode === 'edit' ? 'Canhnangvenon' : 'Tên đội không hoa không dấu không cách',
    emailLabel: category === 'staff'
      ? 'Email thành viên (*)'
      : 'Email đội trưởng (*)',
    emailPlaceholder: category === 'staff'
      ? mode === 'create' ? 'member@untitledui.com' : 'member@untitledui.com'
      : mode === 'edit' ? 'nguyenvana@gmail.com' : 'e.g: doitruong@hcmut.edu.vn',
    error: validationError,
    form,
    handleSubmit,
    hint,
    isSaving: saveUser.isPending,
    resetPassword,
    returnToList,
    setDisplayName: (value: string) => updateForm('displayName', value),
    setEmail: (value: string) => updateForm('email', value),
    setRole: (value: StaffRole) => updateForm('role', value),
    setStatus: (value: UserStatus) => updateForm('status', value),
    setUsername: (value: string) => updateForm('username', value),
    title,
    usernamePlaceholder: category === 'staff'
      ? 'nguyenvana'
      : mode === 'edit' ? 'canhnangvenon' : '',
  }
}
