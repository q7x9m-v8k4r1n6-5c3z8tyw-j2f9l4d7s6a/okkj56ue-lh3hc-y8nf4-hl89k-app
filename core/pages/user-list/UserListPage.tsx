import { UserFormPanel } from '@/core/features/user/create-user'
import { UserTable } from '@/core/features/user/user-list'

/**
 * Composes independent user-list and user-editor feature surfaces.
 */
export const UserListPage = () => (
  <main className="flex h-[calc(100svh-61px)] min-h-0 flex-1 px-4 pb-6 pt-4">
    <section
      aria-label="Quản lý người dùng"
      className="flex min-h-0 w-full flex-1"
    >
      <UserTable />
      <UserFormPanel />
    </section>
  </main>
)
