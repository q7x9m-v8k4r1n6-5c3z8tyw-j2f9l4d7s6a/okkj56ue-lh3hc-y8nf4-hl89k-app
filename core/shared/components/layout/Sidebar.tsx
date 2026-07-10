import { NavLink } from 'react-router-dom'
import {
  raceNavigationIconUrl,
  settingsNavigationIconUrl,
  usersNavigationIconUrl,
} from '@core/assets/icons'

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

const iconByName: Record<SidebarNavigationIcon, { height: number; url: string; width: number }> = {
  race: { height: 16, url: raceNavigationIconUrl, width: 26 },
  settings: { height: 20, url: settingsNavigationIconUrl, width: 32.1 },
  users: { height: 16, url: usersNavigationIconUrl, width: 34 },
}

const NavigationIcon = ({ name }: { name: SidebarNavigationIcon }) => {
  const icon = iconByName[name]
  const mask = `url("${icon.url}") center / 100% 100% no-repeat`

  return (
    <span
      aria-hidden="true"
      className="block shrink-0 bg-current"
      style={{ height: icon.height, mask, WebkitMask: mask, width: icon.width }}
    />
  )
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
        <span className="font-brand text-[40px] font-bold not-italic leading-[31.2px] tracking-[-0.24px] text-[#040000]">
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
              <NavigationIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          </div>
        ))}
      </nav>
    </aside>
  )
}
