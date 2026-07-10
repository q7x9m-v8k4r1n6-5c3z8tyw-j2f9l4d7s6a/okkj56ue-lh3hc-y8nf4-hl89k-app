import { useState, type PropsWithChildren } from 'react'
import { Header, type HeaderUser } from './Header'
import { MainContainer } from './MainContainer'
import { Sidebar, type SidebarNavigationItem } from './Sidebar'

type AppLayoutProps = PropsWithChildren<{
  brand: string
  navigationItems: SidebarNavigationItem[]
  title: string
  user: HeaderUser
  onLogout?: () => void
}>

export const AppLayout = ({
  brand,
  children,
  navigationItems,
  onLogout,
  title,
  user,
}: AppLayoutProps) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)

  return (
    <div className="min-h-svh bg-[#f9f9f9] text-[#1a1c1c]">
      <Sidebar
        brand={brand}
        isOpen={isNavigationOpen}
        items={navigationItems}
        onClose={() => setIsNavigationOpen(false)}
      />

      {isNavigationOpen ? (
        <button
          aria-label="Đóng thanh điều hướng"
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
          onClick={() => setIsNavigationOpen(false)}
          type="button"
        />
      ) : null}

      <div className="min-h-svh lg:pl-[292px]">
        <Header
          onLogout={onLogout}
          onOpenNavigation={() => setIsNavigationOpen(true)}
          title={title}
          user={user}
        />
        <MainContainer>{children}</MainContainer>
      </div>
    </div>
  )
}
