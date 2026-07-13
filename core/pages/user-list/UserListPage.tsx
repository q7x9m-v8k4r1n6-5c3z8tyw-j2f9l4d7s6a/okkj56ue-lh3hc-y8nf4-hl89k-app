import { UserTable } from '@/core/features/user/user-list/ui'

export const UserListPage = () => {
    return (
        <main className="flex h-[calc(100svh-61px)] min-h-0 flex-1 px-4 pb-6 pt-4">
            <section aria-labelledby="user-heading" className="flex min-h-0 w-full flex-1">
                <UserTable />
            </section>
        </main>
    )
}
