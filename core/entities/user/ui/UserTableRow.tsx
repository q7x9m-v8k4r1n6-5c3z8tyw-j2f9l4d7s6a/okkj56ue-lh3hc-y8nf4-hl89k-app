import { EditIcon, TrashIcon } from '@/core/assets'
import { Badge, IconButton } from '@/core/shared'
import type { UserSummary } from '../model/user'

export type UserTableRowProps = {
  user: UserSummary
  onDelete: (user: UserSummary) => void
  onEdit: (user: UserSummary) => void
}

/**
 * Renders a reusable user summary row and delegates workflow actions.
 */
export const UserTableRow = ({ onDelete, onEdit, user }: UserTableRowProps) => {
  return (
    <tr className="h-[72px] border-b border-white">
      <td className="px-6 py-4 text-sm text-[#171717]">
        {user.category === 'staff' ? (
          <span className="flex min-w-0 items-center gap-3">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fde5e5] text-xs font-semibold text-[#8f1c1e]">
                {user.displayName.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'U'}
              </span>
            )}
            <span className="truncate">{user.displayName}</span>
          </span>
        ) : user.displayName}
      </td>
      {user.category === 'team' && (
        <td className="px-6 py-4 text-sm text-[#525252]">{user.username}</td>
      )}
      <td className="px-6 py-4">
        <Badge variant={user.status === 'active' ? 'success' : 'neutral'}>
          {user.status === 'active' ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      <td className="px-6 py-4 text-sm text-[#525252]">{user.email}</td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-[#525252]">
          <IconButton
            aria-label={`Xóa ${user.displayName}`}
            className="rounded-lg p-[10px]"
            icon={<TrashIcon className="size-5" />}
            onClick={() => onDelete(user)}
          />
          <IconButton
            aria-label={`Chỉnh sửa ${user.displayName}`}
            className="rounded-lg p-[10px]"
            icon={<EditIcon className="size-5" />}
            onClick={() => onEdit(user)}
          />
        </div>
      </td>
    </tr>
  )
}
