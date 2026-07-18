import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { NavLink, useLocation, useMatches, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  ChevronIcon,
  LogoutIcon,
  userProfileAvatarUrl,
} from '@/core/assets'
import { useCurrentUser } from '@/core'
import { navigationConfig } from '@/core/shared/config'
import { authApi } from '@/core/features/auth/api'
import { logout } from '@/core/features/auth/stores/authSlice'
import { setAuthToken } from '@/core/shared/api'

const pageItems = Object.values(navigationConfig)
const navigationItems = pageItems.filter(({ hidden }) => !hidden)

export const AppLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation()
  const matches = useMatches()
  const { data: user } = useCurrentUser()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  
  // Bổ sung hook điều hướng và dispatch
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const matchTitle = [...matches].reverse()
    .map((match) => (match.handle as { title?: string } | undefined)?.title)
    .find(Boolean)
  const title = matchTitle ?? pageItems.find(({ to }) => to === location.pathname)?.title ?? 'Move'

  useEffect(() => {
    if (!isProfileOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isProfileOpen])

  // Hàm xử lý Đăng xuất
  const handleLogout = async () => {
  try {
    // 1. Gọi Backend để xóa Refresh Token dưới Cookie
    await authApi.logout()
  } catch (error) {
    console.error('Lỗi khi gọi API logout:', error)
  } finally {
    // DÙ API CÓ LỖI HAY KHÔNG, VẪN PHẢI DỌN DẸP TRÊN FRONTEND (RAM)

    // 2. Xóa Access Token trong biến cục bộ của Axios
    setAuthToken(null)

    // 3. Xóa sạch State trong Redux (Đưa isAuthenticated về false)
    dispatch(logout())

    // 4. Chuyển hướng về Login. 
    // THUỘC TÍNH QUAN TRỌNG: replace: true giúp ghi đè lịch sử trình duyệt, 
    // cắt đứt hoàn toàn khả năng bấm Back quay lại trang cũ.
    navigate('/login', { replace: true })
  }
}

  return (
    <div className="min-h-svh bg-[#f9f9f9] text-[#1a1c1c]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[292px] border-r border-[#d4d4d4] bg-white py-5 md:flex md:flex-col">
        <div className="flex items-center justify-center px-5 pb-[30px]">
          <NavLink
            to="/"
            className="move-logo text-[40px] leading-[31.2px] tracking-[-0.24px] text-[#040000]"
            aria-label="Move - Trang chủ"
          >
            Move
          </NavLink>
        </div>

        <nav className="flex flex-1 flex-col gap-2" aria-label="Điều hướng chính">
          {navigationItems.map(({ label, to, icon: Icon, iconClassName }) => (
            <div className="px-2" key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex w-full items-center rounded-lg px-4 py-3 text-base leading-6 transition-colors ${isActive
                    ? 'bg-gradient-to-r from-[rgba(66,0,1,0.10)] to-[rgba(222,51,54,0.10)] text-[#420001]'
                    : 'text-[rgba(26,28,28,0.70)] hover:bg-[#f7f7f7] hover:text-[#420001]'
                  }`
                }
              >
                <span className="flex w-[34px] shrink-0 items-center">
                  <Icon className={iconClassName} />
                </span>
                <span>{label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
      </aside>

      <div className="min-h-svh md:pl-[292px]">
        <header className="sticky top-0 z-10 flex h-[61px] items-center justify-between bg-white px-[13px] shadow-[0_1px_1.4px_rgba(0,0,0,0.13)]">
          <h1 className="pb-[7.9px] text-[28px] leading-[52.8px] tracking-[-0.96px]">{title}</h1>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="flex items-center gap-3 rounded-lg px-2 py-1"
              aria-label="Mở thông tin tài khoản"
              aria-expanded={isProfileOpen}
              onClick={() => setIsProfileOpen((open) => !open)}
            >
              <span className="size-8 overflow-hidden rounded-full border border-[#e2e2e2] p-px">
                <img src={userProfileAvatarUrl} alt="" className="size-full rounded-full object-cover" />
              </span>
              <ChevronIcon className={`h-[7.4px] w-3 text-[#1a1c1c] transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen ? (
              <section className="absolute right-0 top-[52px] flex w-[245px] flex-col gap-1 rounded-lg bg-white p-[10px] shadow-[0_4px_2.8px_rgba(0,0,0,0.08)]" aria-label="Thông tin tài khoản">
                <div className="flex items-start gap-[10px] py-[5px]">
                  <span className="size-8 shrink-0 overflow-hidden rounded-full border border-[#e2e2e2] p-px">
                    <img src={userProfileAvatarUrl} alt="" className="size-full rounded-full object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex h-4 items-center gap-[5px]">
                      <p className="truncate text-base leading-4">{user?.name ?? 'Nguyễn Văn A'}</p>
                      <span className="size-[7px] shrink-0 rounded-full bg-[#de3336]" />
                    </div>
                    <a className="mt-[5px] block truncate text-[10px] leading-3 tracking-[0.24px] text-[#5e5e5e]" href={`mailto:${user?.email ?? 'admin@university.edu'}`}>
                      {user?.email ?? 'admin@university.edu'}
                    </a>
                  </div>
                </div>

                <div className="rounded-lg bg-[#fdcacb] px-2 py-[5px] text-center text-xs leading-3 tracking-[0.24px] text-[#420001]">
                  {user?.role ?? 'Ban Tổ chức'}
                </div>

                <div className="py-[5px]">
                  <div className="h-px bg-[#e2e2e2]" />
                </div>

                <button
                  type="button"
                  className="flex items-center gap-[10px] pb-[5px] pl-[3px] pr-[10px] text-left text-xs text-[#de3336]"
                  onClick={handleLogout} /* Gắn hàm vào đây */
                >
                  <LogoutIcon className="size-6 shrink-0" />
                  <span className="leading-6">Đăng xuất</span>
                </button>
              </section>
            ) : null}
          </div>
        </header>

        <div className="min-h-[calc(100svh-61px)] bg-white">{children}</div>
      </div>
    </div>
  )
}
