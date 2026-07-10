import type { User } from '@/core/entities/user/model'

type UserCardProps = {
  user: User
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <article className="rounded-lg border border-slate-200 p-4">
      <h2 className="font-medium text-slate-950">{user.name}</h2>
      {user.email ? <p className="mt-1 text-sm text-slate-600">{user.email}</p> : null}
    </article>
  )
}
