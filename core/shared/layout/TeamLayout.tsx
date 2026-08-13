import type { PropsWithChildren, ReactNode } from 'react'
import { ChevronIcon } from '@/core/assets'

export type TeamNavItem = {
  id: string
  label: string
  icon: ReactNode
}

export type TeamLayoutProps = PropsWithChildren<{
  activeNavId?: string
  isMenuOpen?: boolean
  navItems?: TeamNavItem[]
  onHeaderMenuToggle?: () => void
  onNavChange?: (navId: string) => void
  raceName: string
  teamName: string
}>

/**
 * Provides the responsive shell used by team-facing screens.
 *
 * Feature state and actions are injected through props to keep this layout
 * presentation-only.
 */
export const TeamLayout = ({
  activeNavId,
  children,
  isMenuOpen = false,
  navItems = [],
  onHeaderMenuToggle,
  onNavChange,
  raceName,
  teamName,
}: TeamLayoutProps) => (
  <div className="flex min-h-svh flex-col bg-white text-[#323232]">
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center border-b border-[#e2e2e2] bg-white px-5">
      <div className="move-logo mr-3 text-[27px] leading-none text-[#de3336]">
        Move
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-bold uppercase leading-4 text-[#111]">
          {raceName}
        </p>
        <p className="truncate text-[11px] font-bold uppercase leading-3 tracking-[0.6px] text-[#8a8a8a]">
          {teamName}
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

    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>

    {navItems.length > 0 ? (
      <nav className="sticky bottom-0 z-20 bg-white px-3 pb-3" aria-label="Điều hướng đội chơi">
        <div
          className="relative grid h-16 rounded-[15px] bg-[#fafafa] shadow-[0_3px_14px_rgba(0,0,0,0.08)]"
          style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
        >
          {navItems.map((item, index) => {
            const isActive = item.id === activeNavId
            const isScan = item.id === 'scan'
            const isFirst = index === 0
            const isLast = index === navItems.length - 1

            if (isScan) {
              return (
                <div key={item.id} className="relative flex items-center justify-center">
                  <button
                    type="button"
                    className={`absolute -top-4 flex size-[62px] items-center justify-center rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.15)] ${
                      isActive
                        ? 'bg-[#de3336] text-white'
                        : 'bg-[#d9d9d9] text-[#5e5e5e]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={item.label || 'Quét mã QR'}
                    onClick={() => onNavChange?.(item.id)}
                  >
                    <span className="flex items-center justify-center [&>svg]:size-7">
                      {item.icon}
                    </span>
                  </button>
                </div>
              )
            }

            return (
              <button
                key={item.id}
                type="button"
                className={`flex min-w-0 flex-col items-center justify-center gap-1 text-[12px] leading-4 tracking-[0.24px] transition-colors ${
                  isFirst ? 'rounded-l-[15px]' : ''
                } ${isLast ? 'rounded-r-[15px]' : ''} ${
                  isActive
                    ? 'bg-[#de3336] text-white'
                    : 'text-[#5e5e5e] hover:bg-black/5'
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
