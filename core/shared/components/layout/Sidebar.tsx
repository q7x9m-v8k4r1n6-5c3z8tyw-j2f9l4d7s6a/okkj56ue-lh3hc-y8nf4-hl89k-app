import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

export type SidebarNavigationIcon = 'race' | 'settings' | 'users'

export type SidebarNavigationItem = {
  end?: boolean
  icon: SidebarNavigationIcon
  label: string
  to: string
}

type SidebarProps = {
  brand: string
  isOpen: boolean
  items: SidebarNavigationItem[]
  onClose: () => void
}

const RaceIcon = () => (
  <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 14 16" width="14">
    <path d="M2 15V1m0 1h9l-1.7 2L11 6H2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" />
    <path d="M3.7 2v4M6 2v4M8.3 2v4" stroke="currentColor" strokeDasharray="1.2 1.2" strokeWidth="1.2" />
  </svg>
)

const UsersIcon = () => (
  <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 22 16" width="22">
    <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2.5 14c.4-3 2.3-4.5 5.5-4.5s5.1 1.5 5.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
    <path d="M14 3.2a2.6 2.6 0 0 1 0 4.8m1.8 2c2.2.4 3.4 1.7 3.7 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.4" />
  </svg>
)

const SettingsIcon = () => (
  <svg aria-hidden="true" fill="none" height="21" viewBox="0 0 21 21" width="21">
    <path d="m8.8 2 .5-1h2.4l.5 1 .3 1.3 1.2.5 1.1-.7 1.7 1.7-.7 1.1.5 1.2 1.3.3 1 .5v2.4l-1 .5-1.3.3-.5 1.2.7 1.1-1.7 1.7-1.1-.7-1.2.5-.3 1.3-.5 1H9.3l-.5-1-.3-1.3-1.2-.5-1.1.7-1.7-1.7.7-1.1-.5-1.2-1.3-.3-1-.5V8.3l1-.5 1.3-.3.5-1.2-.7-1.1 1.7-1.7 1.1.7 1.2-.5L8.8 2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
    <circle cx="10.5" cy="10.5" r="3" stroke="currentColor" strokeWidth="1.3" />
  </svg>
)

const iconByName: Record<SidebarNavigationIcon, ReactNode> = {
  race: <RaceIcon />,
  settings: <SettingsIcon />,
  users: <UsersIcon />,
}

const iconWidthByName: Record<SidebarNavigationIcon, string> = {
  race: 'w-[26px]',
  settings: 'w-[32px]',
  users: 'w-[34px]',
}

export const Sidebar = ({ brand, isOpen, items, onClose }: SidebarProps) => {
  return (
    <aside
      aria-label="Điều hướng chính"
      className={`fixed inset-y-0 left-0 z-40 flex w-[292px] flex-col border-r border-[#d4d4d4] bg-white py-5 pr-px transition-transform duration-200 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-[62px] shrink-0 items-start justify-center px-5 pb-[30px]">
        <span className="font-sans text-[40px] font-extrabold not-italic leading-[32px] tracking-[-1.1px] text-[#040000]">
          {brand}
        </span>
        <button
          aria-label="Đóng menu"
          className="absolute right-4 top-6 grid size-8 place-items-center rounded-lg text-[#5e5e5e] hover:bg-[#f5f5f5] lg:hidden"
          onClick={onClose}
          type="button"
        >
          <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
            <path d="m3 3 12 12M15 3 3 15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      <nav className="mt-0 flex flex-col gap-2" aria-label="Menu MOVE">
        {items.map((item) => (
          <div className="px-2" key={item.to}>
            <NavLink
              className={({ isActive }) =>
                `flex h-12 items-center rounded-lg px-4 text-base leading-6 transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-[rgba(66,0,1,0.1)] to-[rgba(222,51,54,0.1)] text-[#420001]'
                    : 'text-[rgba(26,28,28,0.7)] hover:bg-[#f7f7f7] hover:text-[#1a1c1c]'
                }`
              }
              end={item.end}
              onClick={onClose}
              to={item.to}
            >
              <span className={`flex shrink-0 items-center ${iconWidthByName[item.icon]}`}>
                {iconByName[item.icon]}
              </span>
              <span>{item.label}</span>
            </NavLink>
          </div>
        ))}
      </nav>
    </aside>
  )
}
