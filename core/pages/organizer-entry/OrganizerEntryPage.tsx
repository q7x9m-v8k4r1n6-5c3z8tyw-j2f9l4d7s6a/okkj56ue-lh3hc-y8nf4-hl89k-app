import { GridMenuIcon, RaceIcon } from '@/core/assets/icons'
import { useAuthSession } from '@/core/features/auth'
import { useNavigate } from 'react-router-dom'

const hasAdminAccess = (
  roles: readonly string[] = [],
  permissions: readonly string[] = [],
) => (
  roles.some((role) => role.toLowerCase() === 'admin') ||
  permissions.some((permission) => permission.toLowerCase() === 'race.manage')
)

/** Lets organizer accounts choose their working area after signing in. */
export const OrganizerEntryPage = () => {
  const navigate = useNavigate()
  const { user } = useAuthSession()
  const canOpenAdmin = hasAdminAccess(user?.roles, user?.permissions)
  const destinations = [
    {
      disabled: !canOpenAdmin,
      icon: GridMenuIcon,
      path: '/',
      title: 'Trang quản trị',
    },
    {
      disabled: false,
      icon: RaceIcon,
      path: '/organizer',
      title: 'Trang trò chơi',
    },
  ] as const

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f9f9f9] px-4 py-10">
      <section className="w-full max-w-3xl" aria-labelledby="organizer-entry-heading">
        <header className="mx-auto mb-8 max-w-xl text-center">
          <h1
            id="organizer-entry-heading"
            className="mt-2 text-3xl font-extrabold tracking-tight text-[#1a1c1c] sm:text-4xl"
          >
            Chọn khu vực làm việc
          </h1>
        </header>

        <div className="grid gap-5 md:grid-cols-2">
          {destinations.map(({ disabled, icon: Icon, path, title }) => (
            <button
              key={path}
              type="button"
              disabled={disabled}
              onClick={() => navigate(path)}
              className="group rounded-2xl border border-[#e5e5e5] bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#de3336] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#de3336] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:border-[#e5e5e5] disabled:hover:shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0f0] text-[#de3336]">
                <Icon className="h-6 w-6" />
              </span>
              <span className="mt-6 block text-xl font-bold text-[#1a1c1c]">
                {title}
              </span>
              <span className="mt-6 inline-flex items-center text-sm font-semibold text-[#de3336]">
                {disabled ? 'Không có quyền' : 'Truy cập'}
                {!disabled ? <span className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span> : null}
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}
