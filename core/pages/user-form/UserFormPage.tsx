import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CloseIcon } from '@/core/assets'
import { MoveButton, MoveIconButton, MovePanel } from '@/core/shared'
import {
  MOVE_DEFAULT_PASSWORD,
  buildStaffIdentityFromEmail,
  getUserRecord,
  saveUserRecord,
  validateUserUsername,
  type StaffRole,
  type UserCategory,
  type UserStatus,
} from '@/core/shared/lib'

type UserFormPageProps = {
  category: UserCategory
  mode: 'create' | 'edit'
}

const getReturnPath = () => '/users'
const getLabel = (category: UserCategory) => category === 'staff' ? 'thành viên' : 'đội chơi'

export const UserFormPage = ({ category, mode }: UserFormPageProps) => {
  const navigate = useNavigate()
  const { userId = '' } = useParams()
  const existingRow = useMemo(() => mode === 'edit' ? getUserRecord(category, userId) : null, [category, mode, userId])
  const [displayName, setDisplayName] = useState(existingRow?.displayName ?? '')
  const [username, setUsername] = useState(existingRow?.username ?? '')
  const [email, setEmail] = useState(existingRow?.email ?? '')
  const [role, setRole] = useState<StaffRole>(existingRow?.role || 'coordinator')
  const [status, setStatus] = useState<UserStatus>(existingRow?.status ?? 'active')
  const [password, setPassword] = useState(existingRow?.password ?? MOVE_DEFAULT_PASSWORD)
  const [hint, setHint] = useState('')
  const [error, setError] = useState('')

  if (mode === 'edit' && !existingRow) {
    return (
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-4">
        <section className="w-full max-w-[32rem]">
          <MovePanel className="p-6">
            <h2 className="text-lg font-semibold text-[#1f1f22]">Không tìm thấy dữ liệu</h2>
            <p className="mt-2 text-sm text-[#8b8580]">
              Người dùng cần chỉnh sửa không còn tồn tại hoặc đường dẫn không hợp lệ.
            </p>
            <div className="mt-4">
              <MoveButton variant="secondary" onClick={() => navigate(getReturnPath(), { state: { activeTab: category } })}>Quay lại</MoveButton>
            </div>
          </MovePanel>
        </section>
      </main>
    )
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
    ? 'member@untitledui.com'
    : mode === 'edit' ? 'nguyenvana@gmail.com' : 'e.g: doitruong@hcmut.edu.vn'

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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

    const savedRow = saveUserRecord({
      id: existingRow?.id ?? 0,
      category,
      displayName: nextDisplayName,
      username: nextUsername,
      password,
      email: nextEmail,
      role: category === 'staff' ? role : '',
      status,
      inviteEmail: false,
      note: existingRow?.note ?? '',
    }, mode)

    if (!savedRow) {
      setError('Không thể lưu thông tin trên trình duyệt hiện tại.')
      return
    }

    navigate(getReturnPath(), {
      state: {
        activeTab: category,
        toastMessage: mode === 'edit' ? `Đã cập nhật ${getLabel(category)}.` : `Đã tạo ${getLabel(category)} mới.`,
      },
    })
  }

  return (
    <main className="flex flex-1 items-start justify-center px-4 py-4 sm:px-6 sm:py-4">
      <section className="w-full max-w-[32rem]">
        <MovePanel>
          <div className="flex items-center justify-between border-b border-[#f1ebe8] px-5 py-4">
            <div>
              <h1 className="text-[1.45rem] font-semibold tracking-tight text-[#1f1f22]">{title}</h1>
            </div>
            <MoveIconButton aria-label="Đóng" icon={<CloseIcon className="h-5 w-5" />} onClick={() => navigate(getReturnPath(), { state: { activeTab: category } })} />
          </div>

          <form className="px-5 py-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!(category === 'staff' && mode === 'create') ? (
                <label className="block">
                  <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">{displayNameLabel}</span>
                  <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} type="text" required className="w-full rounded-lg border border-[#e8e0dc] bg-white px-4 py-3 text-sm text-[#3f3b39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" placeholder={displayNamePlaceholder} />
                </label>
              ) : null}

              {category !== 'staff' ? (
                <label className="block">
                  <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">Username (*)</span>
                  <input value={username} onChange={(event) => setUsername(event.target.value)} type="text" required className="w-full rounded-lg border border-[#e8e0dc] bg-white px-4 py-3 text-sm text-[#3f3b39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10" placeholder={usernamePlaceholder} />
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">{emailLabel}</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  disabled={mode === 'edit'}
                  className={`w-full rounded-lg border border-[#e8e0dc] px-4 py-3 text-sm text-[#3f3b39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10 ${mode === 'edit' ? 'cursor-not-allowed bg-[#f7f5f4] text-[#8b8580]' : 'bg-white'}`}
                  placeholder={emailPlaceholder}
                />
              </label>

              {category === 'staff' ? (
                <label className="block">
                  <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">Vai trò (*)</span>
                  <select value={role} onChange={(event) => setRole(event.target.value as StaffRole)} className="w-full rounded-lg border border-[#e8e0dc] bg-white px-4 py-3 text-sm text-[#3f3b39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10">
                    <option value="admin">Quản trị viên</option>
                    <option value="coordinator">Điều phối viên</option>
                    <option value="support">Hỗ trợ</option>
                  </select>
                </label>
              ) : null}

              {mode === 'edit' ? (
                <label className="block">
                  <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7f7772]">Trạng thái</span>
                  <select value={status} onChange={(event) => setStatus(event.target.value as UserStatus)} className="w-full rounded-lg border border-[#e8e0dc] bg-white px-4 py-3 text-sm text-[#3f3b39] outline-none transition focus:border-[#f4b3b3] focus:ring-2 focus:ring-[#ef4444]/10">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              ) : null}

              {mode === 'edit' && category !== 'staff' ? (
                <MoveButton
                  type="button"
                  variant="danger"
                  size="lg"
                  className="w-full"
                  onClick={() => {
                    setPassword(MOVE_DEFAULT_PASSWORD)
                    setHint(`Mật khẩu sẽ được đặt lại về ${MOVE_DEFAULT_PASSWORD} sau khi bạn nhấn Lưu.`)
                    setError('')
                  }}
                >
                  Cấp lại mật khẩu mới
                </MoveButton>
              ) : null}

              {hint ? <p className="rounded-xl border border-[#f0e7d7] bg-[#fff9eb] px-4 py-3 text-sm text-[#8a6b21]">{hint}</p> : null}
              {error ? <p className="rounded-xl border border-[#f3d7d5] bg-[#fff5f5] px-4 py-3 text-sm font-medium text-[#b43b35]">{error}</p> : null}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#f1ebe8] pt-4">
              <MoveButton type="button" variant="secondary" size="md" onClick={() => navigate(getReturnPath(), { state: { activeTab: category } })}>Hủy</MoveButton>
              <MoveButton type="submit" size="md">Lưu</MoveButton>
            </div>
          </form>
        </MovePanel>
      </section>
    </main>
  )
}
