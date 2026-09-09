import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { AppLayout } from './AppLayout'

vi.mock('./useAppLayout', () => ({
  useAppLayout: () => ({
    displayName: 'Admin User',
    isLoggingOut: false,
    isProfileOpen: true,
    logout: vi.fn(),
    navigationItems: [
      {
        label: 'Dashboard',
        to: '/dashboard',
        icon: () => null,
        iconClassName: '',
      },
    ],
    profileRef: { current: null },
    returnToNavigation: vi.fn(),
    setIsProfileOpen: vi.fn(),
    title: 'Test Dashboard',
    user: { email: 'admin@example.com', avatarUrl: null },
    isPanelCollapsed: false,
    togglePanel: vi.fn(),
  }),
}))

describe('AppLayout z-index layering', () => {
  it('renders header with z-30 to stay above scrollable content and aside', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AppLayout>
          <div>Main Content</div>
        </AppLayout>
      </MemoryRouter>,
    )

    expect(html).toContain('sticky top-0 z-30')
  })

  it('renders account dropdown menu with z-50 and correct shadow for maximum priority', () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <AppLayout>
          <div>Main Content</div>
        </AppLayout>
      </MemoryRouter>,
    )

    expect(html).toContain('z-50')
    expect(html).toContain('shadow-[0_4px_16px_rgba(0,0,0,0.12)]')
    expect(html).toContain('aria-label="Thông tin tài khoản"')
  })
})
