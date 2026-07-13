import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import type { StaffRole, UserCategory, UserStatus } from '@/core/entities/user/model'
import { useToast } from '@/core/shared'
import { createOrganizer, createTeam, getOrganizerDetail, getTeamDetail, updateOrganizer, updateTeam } from '../../api'
import { buildStaffIdentityFromEmail, DEFAULT_USER_PASSWORD, validateUserUsername } from '../../helpers'
import type { UserFormProps } from '../../models'

const getReturnPath = () => '/users'
const getLabel = (category: UserFormProps['category']) => category === 'staff' ? 'thành viên' : 'đội chơi'

type EditableUserRow = {
  id: number
  category: UserCategory
  displayName: string
  username: string
  password: string
  email: string
  role: StaffRole | ''
  status: UserStatus
}

export const useUserForm = ({ category, mode, onClose, onSaved, userId }: UserFormProps) => {
  const navigate = useNavigate()
  const { userId: routeUserId = '' } = useParams()
  const { toast } = useToast()
  const currentUserId = userId ?? routeUserId
  const numericUserId = Number(currentUserId)
  const canLoadExistingRow = mode === 'edit' && Number.isFinite(numericUserId) && numericUserId > 0
  const existingUserQuery = useQuery({
    queryKey: ['user-form-detail', category, numericUserId],
    queryFn: async ({ signal }) => {
      if (category === 'team') {
        const team = await getTeamDetail(numericUserId, signal)

        return {
          id: team.id,
          category: 'team' as const,
          displayName: team.name,
          username: team.username,
          password: team.password ?? DEFAULT_USER_PASSWORD,
          email: team.leaderEmail,
          role: '' as const,
          status: team.status,
        }
      }

      const organizer = await getOrganizerDetail(numericUserId, signal)

      return {
        id: organizer.id,
        category: 'staff' as const,
        displayName: organizer.displayName,
        username: organizer.username ?? organizer.email.split('@')[0] ?? '',
        password: organizer.password ?? DEFAULT_USER_PASSWORD,
        email: organizer.email,
        role: organizer.role,
        status: organizer.status,
      }
    },
    enabled: canLoadExistingRow,
  })
  const existingRow = useMemo<EditableUserRow | null>(() => {
    if (mode !== 'edit') return null
    return existingUserQuery.data ?? null
  }, [existingUserQuery.data, mode])
  const [displayName, setDisplayName] = useState(existingRow?.displayName ?? '')
  const [username, setUsername] = useState(existingRow?.username ?? '')
  const [email, setEmail] = useState(existingRow?.email ?? '')
  const [role, setRole] = useState<StaffRole | ''>(existingRow?.role || (mode === 'create' ? '' : 'coordinator'))
  const [status, setStatus] = useState<UserStatus>(existingRow?.status ?? 'active')
  const [password, setPassword] = useState(existingRow?.password ?? DEFAULT_USER_PASSWORD)
  const [hint, setHint] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!existingRow) return

    setDisplayName(existingRow.displayName)
    setUsername(existingRow.username)
    setEmail(existingRow.email)
    setRole(existingRow.role || 'coordinator')
    setStatus(existingRow.status)
    setPassword(existingRow.password)
  }, [existingRow])

  const returnToList = () => {
    if (onClose) {
      onClose()
      return
    }

    navigate(getReturnPath(), { state: { activeTab: category } })
  }

  const title = category === 'staff'
    ? mode === 'edit' ? 'Chỉnh sửa Ban Tổ chức' : 'Thêm mới Ban Tổ chức'
    : mode === 'edit' ? 'Chỉnh sửa đội chơi' : 'Thêm đội chơi mới'

  const displayNameLabel = category === 'staff'
    ? mode === 'edit' ? 'Tên hiển thị (*)' : 'Họ và tên'
    : 'Tên đội chơi (*)'

  const displayNamePlaceholder = category === 'staff'
    ? 'Nguyen Van A'
    : mode === 'edit' ? 'Canhnangvenon' : 'Tên đội không hoa không dấu không cách'

  const usernamePlaceholder = category === 'staff'
    ? 'nguyenvana'
    : mode === 'edit' ? 'canhnangvenon' : ''

  const emailLabel = category === 'staff' ? 'Email thành viên (*)' : 'Email đội trưởng (*)'
  const emailPlaceholder = category === 'staff'
    ? mode === 'create' ? 'Tên đội không hoa không dấu không cách' : 'member@untitledui.com'
    : mode === 'edit' ? 'nguyenvana@gmail.com' : 'e.g: doitruong@hcmut.edu.vn'

  const resetPassword = () => {
    setPassword(DEFAULT_USER_PASSWORD)
    setHint(`Mật khẩu sẽ được đặt lại về ${DEFAULT_USER_PASSWORD} sau khi bạn nhấn Lưu.`)
    setError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    let nextDisplayName = displayName.trim()
    let nextUsername = username.trim()
    const nextEmail = email.trim()

    if (category === 'staff') {
      if (!nextEmail || !role || (mode === 'edit' && !nextDisplayName)) {
        setError(mode === 'edit'
          ? 'Vui lòng nhập đầy đủ tên hiển thị, email và vai trò.'
          : 'Vui lòng nhập đầy đủ email và vai trò.')
        return
      }

      if (mode === 'create') {
        const derivedIdentity = buildStaffIdentityFromEmail(nextEmail)
        nextUsername = derivedIdentity.username
        nextDisplayName = derivedIdentity.displayName || 'Thành viên BTC'

        if (!nextUsername) {
          setError('Email chưa hợp lệ để tạo tên đăng nhập cho Ban Tổ chức.')
          return
        }
      } else if (!nextUsername) {
        nextUsername = existingRow?.username ?? ''
      }
    }

    if (category === 'team' && (!nextDisplayName || !nextUsername || !nextEmail)) {
      setError('Vui lòng nhập đầy đủ tên hiển thị, username và email.')
      return
    }

    if (nextUsername) {
      const usernameError = validateUserUsername(category, nextUsername)
      if (usernameError) {
        setError(usernameError)
        return
      }
    }

    const selectedRole = role || 'coordinator'
    const savedRow = category === 'staff'
      ? mode === 'create'
        ? await createOrganizer({
          displayName: nextDisplayName,
          username: nextUsername,
          password,
          email: nextEmail,
          role: selectedRole,
          status,
        })
        : await updateOrganizer({
          id: existingRow?.id ?? 0,
          displayName: nextDisplayName,
          username: nextUsername,
          password,
          email: nextEmail,
          role: selectedRole,
          status,
        })
      : mode === 'create'
        ? await createTeam({
          displayName: nextDisplayName,
          username: nextUsername,
          password,
          email: nextEmail,
          status,
        })
        : await updateTeam({
          id: existingRow?.id ?? 0,
          displayName: nextDisplayName,
          username: nextUsername,
          password,
          email: nextEmail,
          status,
        })

    if (!savedRow) {
      setError('Không thể lưu thông tin trên trình duyệt hiện tại.')
      return
    }

    const toastMessage = mode === 'edit' ? `Đã cập nhật ${getLabel(category)}.` : `Đã tạo ${getLabel(category)} mới.`

    if (onSaved) {
      toast({ title: 'Thông báo', description: toastMessage })
      onSaved()
      return
    }

    navigate(getReturnPath(), {
      state: {
        activeTab: category,
        toastMessage,
      },
    })
  }

  return {
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
    isLoadingExistingRow: existingUserQuery.isLoading,
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
  }
}
