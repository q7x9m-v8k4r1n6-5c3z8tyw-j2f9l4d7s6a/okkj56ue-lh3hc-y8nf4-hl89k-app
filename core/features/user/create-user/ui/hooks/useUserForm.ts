import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { StaffRole, UserStatus } from '@/core/entities/user'
import { useToast } from '@/core/shared'
import { createEmptyUserForm, type EditableUser, type UserFormProps } from '../../model/userForm'
import { prepareUserForm } from '../../model/userForm.validation'
import { useSaveUserMutation } from '../../model/server/useSaveUserMutation'
import { useResetTeamPasswordMutation } from '../../model/server/useResetTeamPasswordMutation'

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
  const resetTeamPassword = useResetTeamPasswordMutation()
  const [form, setForm] = useState<EditableUser>(
    initialForm ?? createEmptyUserForm,
  )
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

  const resetPassword = async () => {
    if (!form.id) return
    try {
      await resetTeamPassword.mutateAsync(form.id)
      toast({
        title: 'Thông báo',
        description: 'Đã cấp mật khẩu mới và gửi thông tin đăng nhập qua email đội trưởng.',
      })
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : 'Không thể cấp lại mật khẩu.',
      )
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const prepared = prepareUserForm(category, mode, form)
    if (!prepared.form) {
      setValidationError(prepared.error ?? 'Dữ liệu chưa hợp lệ.')
      return
    }

    try {
      await saveUser.mutateAsync({
        category,
        mode,
        form: prepared.form,
        resetPassword: false,
      })
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
    hint: '',
    isResettingPassword: resetTeamPassword.isPending,
    isSaving: saveUser.isPending,
    resetPassword,
    returnToList,
    setDisplayName: (value: string) => updateForm('displayName', value),
    setEmail: (value: string) => updateForm('email', value),
    setRole: (value: StaffRole) => updateForm('role', value),
    setRoleIds: (value: string[]) => updateForm('roleIds', value),
    setStatus: (value: UserStatus) => updateForm('status', value),
    setUsername: (value: string) => updateForm('username', value),
    title,
    usernamePlaceholder: category === 'staff'
      ? 'nguyenvana'
      : mode === 'edit' ? 'canhnangvenon' : '',
  }
}
