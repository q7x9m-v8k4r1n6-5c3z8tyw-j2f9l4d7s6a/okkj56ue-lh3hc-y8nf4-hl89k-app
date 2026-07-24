import type { EditRaceForm } from './models'

export const EDIT_RACE_INITIAL_FORM: EditRaceForm = {
  raceName: 'Move 2026',
  timeStart: '2026-09-09T00:00:00',
  timeEnd: '2026-09-10T00:00:00',
  coverUrl: '',
  coverFileName: '',
  place: 'Sân đấu Phú Thọ',
  status: 'draft',
  modifiedAt: '',
  booths: [
    {
      id: 'station-1',
      name: 'Trạm 1',
      place: 'Tòa B6',
      managers: [{ id: 'manager-1', displayName: 'Olivia Rhye', email: 'olivia@move.local' }],
      description: 'Luật chơi trạm này là hoàn thành thử thách theo chỉ dẫn của quản trạm.',
    },
    {
      id: 'station-2',
      name: 'Trạm 2',
      place: 'Sân sau Tòa A4',
      managers: [{ id: 'manager-2', displayName: 'Phoenix Baker', email: 'phoenix@move.local' }],
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
