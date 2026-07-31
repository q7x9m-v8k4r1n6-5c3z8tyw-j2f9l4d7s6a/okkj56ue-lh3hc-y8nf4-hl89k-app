import type {
  StaffRole,
  UserCategory,
  UserStatus,
} from '@/core/entities/user'

export type UserFormMode = 'create' | 'edit'

export type UserFormProps = {
  category: UserCategory
  mode: UserFormMode
  open?: boolean
  userId?: string
  onClose?: () => void
  onSaved?: () => void
}

export type EditableUser = {
  id?: string
  displayName: string
  username: string
  password: string
  email: string
  role: StaffRole | ''
  roleIds: string[]
  status: UserStatus
}

export const DEFAULT_USER_PASSWORD = 'Mymycute'

/** Creates the blank frontend form used by the create workflow. */
export const createEmptyUserForm = (): EditableUser => ({
  displayName: '',
  username: '',
  email: '',
  role: '',
  roleIds: [],
  status: 'active',
  password: DEFAULT_USER_PASSWORD,
})
