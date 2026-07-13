import { EditIcon, TrashIcon } from '@/core/assets'
import type { UserTableRowModel } from '@/core/entities/user/model'
import { Badge, IconButton } from '@/core/shared'

type UserTableRowProps = {
  user: UserTableRowModel
  onDelete: (user: UserTableRowModel) => void
  onEdit: (user: UserTableRowModel) => void
}

export const UserTableRow = ({ onDelete, onEdit, user }: UserTableRowProps) => {
  return (
    <tr className="h-[72px] border-b border-white">
      <td className="px-6 py-4">
        <input type="checkbox" className="size-5 rounded-md border-[#d4d4d4]" />
      </td>
      <td className="px-6 py-4 text-sm text-[#171717]">{user.displayName}</td>
      <td className="px-6 py-4 text-sm text-[#525252]">{user.username}</td>
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
