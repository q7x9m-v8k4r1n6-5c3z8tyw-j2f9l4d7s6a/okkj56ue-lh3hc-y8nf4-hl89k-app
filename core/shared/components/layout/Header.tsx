import { useEffect, useRef, useState } from 'react'

export type HeaderUser = {
  email: string
  name: string
  role: string
}

type HeaderProps = {
  onLogout?: () => void
  onOpenNavigation: () => void
  title: string
  user: HeaderUser
}

const UserAvatar = () => (
  <span className="relative block size-[30px] overflow-hidden rounded-full bg-[linear-gradient(145deg,#d9eff0_0%,#efc9ae_55%,#704b3d_100%)]">
    <svg aria-hidden="true" className="absolute inset-0 size-full" viewBox="0 0 30 30">
      <circle cx="15" cy="11" fill="#edc4a6" r="6" />
      <path d="M7 30c.6-7 3.2-10 8-10s7.4 3 8 10" fill="#4f6e78" />
      <path d="M9.2 10.8c.2-5 2.3-7.5 6.2-7.5 3.4 0 5.4 2 5.8 6.1-2.7-.3-5.1-1.4-7-3.2-1 2.1-2.7 3.6-5 4.6Z" fill="#40332f" />
    </svg>
  </span>
)

const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    aria-hidden="true"
    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
    fill="none"
    height="8"
    viewBox="0 0 12 8"
    width="12"
  >
    <path d="m1 1.5 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
  </svg>
)

const LogoutIcon = () => (
  <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
    <path d="M14 5H7.5A1.5 1.5 0 0 0 6 6.5v11A1.5 1.5 0 0 0 7.5 19H14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    <path d="m14.5 8.5 3.5 3.5-3.5 3.5M10 12h8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
  </svg>
)

export const Header = ({ onLogout, onOpenNavigation, title, user }: HeaderProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(true)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeProfile = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    const closeProfileWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', closeProfile)
    document.addEventListener('keydown', closeProfileWithEscape)

    return () => {
      document.removeEventListener('mousedown', closeProfile)
      document.removeEventListener('keydown', closeProfileWithEscape)
    }
  }, [])

  return (
    <header className="relative z-20 flex h-[61px] items-center justify-between bg-white px-[13px] shadow-[0_1px_1.4px_rgba(0,0,0,0.13)]">
      <div className="flex min-w-0 items-center gap-2">
        <button
          aria-label="Mở menu"
          className="grid size-10 shrink-0 place-items-center rounded-lg text-[#5e5e5e] hover:bg-[#f5f5f5] lg:hidden"
          onClick={onOpenNavigation}
          type="button"
        >
          <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 22 20" width="22">
            <path d="M2 4h18M2 10h18M2 16h18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </button>
        <h1 className="truncate text-[22px] leading-[53px] tracking-[-0.5px] text-[#1a1c1c] sm:text-[28px] sm:tracking-[-0.96px]">
          {title}
        </h1>
      </div>

      <div className="relative shrink-0" ref={profileRef}>
        <button
          aria-expanded={isProfileOpen}
          aria-haspopup="menu"
          aria-label="Mở thông tin tài khoản"
          className="flex h-10 w-[72px] items-center gap-3 rounded-lg px-2 py-1 text-[#5e5e5e] hover:bg-[#f7f7f7]"
          onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
          type="button"
        >
          <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-[#e2e2e2] p-px">
            <UserAvatar />
          </span>
          <ChevronDownIcon isOpen={isProfileOpen} />
        </button>

        {isProfileOpen ? (
          <div
            aria-label="Thông tin tài khoản"
            className="absolute right-0 top-[49px] w-[245px] rounded-lg bg-white p-[10px] shadow-[0_4px_2.8px_rgba(0,0,0,0.08)]"
            role="menu"
          >
            <div className="flex h-12 items-start gap-[10px] py-[5px]">
              <span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-[#e2e2e2] p-px">
                <UserAvatar />
              </span>
              <div className="min-w-0 pt-px">
                <div className="flex items-center gap-[5px]">
                  <p className="truncate text-base leading-4 text-[#1a1c1c]">{user.name}</p>
                  <span aria-label="Đang hoạt động" className="size-[7px] shrink-0 rounded-full bg-[#22c55e]" />
                </div>
                <p className="mt-[5px] truncate text-[10px] leading-3 tracking-[0.24px] text-[#5e5e5e]">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex h-[22px] items-center justify-center rounded-lg bg-[#fdcacb] px-2 py-[5px] text-xs leading-3 tracking-[0.24px] text-[#420001]">
              {user.role}
            </div>

            <div className="py-[10px]">
              <div className="border-t border-[#dedede]" />
            </div>

            <button
              className="flex h-[29px] w-full items-center gap-[9px] rounded-md pl-[3px] pr-[10px] text-left text-xs leading-6 text-[#de3336] hover:bg-[#fff5f5]"
              onClick={onLogout}
              role="menuitem"
              type="button"
            >
              <LogoutIcon />
              <span>Đăng xuất</span>
            </button>
          </div>
        ) : null}
      </div>
    </header>
  )
}
