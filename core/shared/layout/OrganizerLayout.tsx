import type { PropsWithChildren, ReactNode } from 'react'
import { ChevronIcon } from '@/core/assets'

export type OrganizerNavItem = {
  id: string
  label: string
  icon: ReactNode
}

export type OrganizerLayoutProps = PropsWithChildren<{
  activeNavId?: string
  isMenuOpen?: boolean
  navItems?: OrganizerNavItem[]
  onHeaderMenuToggle?: () => void
  onNavChange?: (navId: string) => void
  raceName: string
  stationName: string
}>

/**
 * Provides the responsive shell used by organizer-facing screens.
 */
export const OrganizerLayout = ({
  activeNavId,
  children,
  isMenuOpen = false,
  navItems = [],
  onHeaderMenuToggle,
  onNavChange,
  raceName,
  stationName,
}: OrganizerLayoutProps) => (
  <div className="flex min-h-svh flex-col bg-white text-[#323232]">
    <header className="sticky top-0 z-20 flex h-[73px] shrink-0 items-center border-b border-[#e5e5e5] bg-white px-5">
      <div className="move-logo mr-3 text-[27px] leading-none text-[#de3336]">
        Move
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold uppercase leading-4 text-[#040000]">
          {raceName}
        </p>
        <p className="truncate text-[11px] font-bold uppercase leading-3 tracking-[0.6px] text-[#5e5e5e]">
          {stationName}
        </p>
      </div>
      <button
        type="button"
        className="ml-3 flex size-10 items-center justify-center rounded-full text-[#5e5e5e] transition-colors hover:bg-[#f5f5f5]"
        aria-label={isMenuOpen ? 'Thu gọn menu' : 'Mở rộng menu'}
        aria-expanded={isMenuOpen}
        onClick={onHeaderMenuToggle}
      >
        <ChevronIcon className={`h-[9px] w-[15px] transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
      </button>
    </header>

    <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>

    {navItems.length > 0 ? (
      <nav className="sticky bottom-0 z-20 bg-white px-3 pb-3" aria-label="Điều hướng quản trạm">
        <div
          className="grid h-16 overflow-hidden rounded-[15px] bg-[#fafafa] shadow-[0_3px_14px_rgba(0,0,0,0.08)]"
          style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
        >
          {navItems.map((item) => {
            const isActive = item.id === activeNavId

            return (
              <button
                key={item.id}
                type="button"
                className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[13px] leading-4 transition-colors ${isActive
                  ? 'bg-[#de3336] text-white'
                  : 'bg-[#f9f9f9] text-[#525252] hover:bg-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavChange?.(item.id)}
              >
                <span className="flex h-6 items-center justify-center [&>svg]:size-5">
                  {item.icon}
                </span>
                <span className="truncate px-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    ) : null}
  </div>
)
