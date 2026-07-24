import { userProfileAvatarUrl } from '@/core/assets'

export const AvatarName = ({ name }: { name: string }) => (
  <span className="flex min-w-0 items-center gap-3">
    <img src={userProfileAvatarUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" />
    <span className="truncate">{name}</span>
  </span>
)
