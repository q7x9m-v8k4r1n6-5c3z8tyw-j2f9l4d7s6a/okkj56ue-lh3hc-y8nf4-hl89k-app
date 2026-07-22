import type { EditRaceForm } from './models'

export const EDIT_RACE_TABS = [
  { value: 'basic', label: 'Thông tin cơ bản' },
  { value: 'live', label: 'Trực tiếp trận đấu' },
  { value: 'cards', label: 'Quản lý thẻ' },
  { value: 'secret', label: 'Quản lý nhiệm vụ bí mật' },
  { value: 'history', label: 'Lịch sử hoạt động' },
  { value: 'message', label: 'Gửi tin nhắn' },
]

export const EDIT_RACE_INITIAL_FORM: EditRaceForm = {
  raceName: 'Move 2026',
  timeStart: '2026-09-09',
  timeEnd: '2026-09-10',
  coverUrl: '',
  coverFileName: '',
  place: 'Sân đấu Phú Thọ',
  booths: [
    {
      id: 'station-1',
      name: 'Trạm 1',
      place: 'Tòa B6',
      managerId: 'manager-1',
      managerName: 'Olivia Rhye',
      description: 'Luật chơi trạm này là hoàn thành thử thách theo chỉ dẫn của quản trạm.',
    },
    {
      id: 'station-2',
      name: 'Trạm 2',
      place: 'Sân sau Tòa A4',
      managerId: 'manager-2',
      managerName: 'Phoenix Baker',
      description: 'Luật chơi trạm này là hoàn thành thử thách theo chỉ dẫn của quản trạm.',
    },
  ],
  teams: [
    { id: 'team-1', leaderEmail: 'doi1@gmail.com', name: 'Đội 1' },
    { id: 'team-2', leaderEmail: 'doi2@gmail.com', name: 'Đội 2' },
  ],
  organizers: [
    { id: 'organizer-1', displayName: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com' },
    { id: 'organizer-2', displayName: 'Nguyễn Thị B', email: 'nguyenthib@gmail.com' },
    { id: 'organizer-3', displayName: 'Nguyễn Thị B', email: 'nguyenthib@gmail.com' },
  ],
  settings: {
    isToggledLeaderboard: false,
    isHiddenPoint: false,
  },
}
