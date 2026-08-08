import { UsersIcon } from '@/core/assets'
import type { SearchOption } from '@/core/shared'

export const prototypeRoleOptions = [
  {
    value: 'admin',
    label: 'Quản trị viên',
    description: 'Toàn quyền quản lý giải đấu',
  },
  {
    value: 'organizer',
    label: 'Ban Tổ chức',
    description: 'Quản lý đội chơi và trận đấu',
  },
  {
    value: 'referee',
    label: 'Trọng tài',
    description: 'Cập nhật kết quả trận đấu',
  },
  {
    value: 'viewer',
    label: 'Khách xem',
    description: 'Chỉ có quyền xem dữ liệu',
  },
]

export const prototypeSearchOptions: SearchOption[] = Array.from(
  { length: 18 },
  (_, index) => ({
    id: String(index + 1),
    label: `Đội thi ${String(index + 1).padStart(2, '0')}`,
    description: index % 2 === 0
      ? 'Đại học Bách khoa Hà Nội'
      : 'Đại học Công nghệ',
    keywords: [
      `team-${index + 1}`,
      index % 2 === 0 ? 'bach khoa' : 'cong nghe',
    ],
    icon: index < 2 ? <UsersIcon className="size-4" /> : undefined,
  }),
)

export const prototypeTeams = [
  {
    id: 'olivia',
    name: 'Olivia Rhye',
    username: 'olivia',
    email: 'olivia@untitledui.com',
  },
  {
    id: 'phoenix',
    name: 'Phoenix Baker',
    username: 'phoenix',
    email: 'phoenix@untitledui.com',
  },
]
