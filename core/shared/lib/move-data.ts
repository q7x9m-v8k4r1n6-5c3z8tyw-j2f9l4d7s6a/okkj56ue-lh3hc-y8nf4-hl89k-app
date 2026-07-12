export type RaceStatus = 'upcoming' | 'live' | 'done'

export type MoveRaceStation = {
  name: string
  location: string
  manager: string
  points: string
}

export type MoveNameMissionRow = {
  name: string
  mission: string
}

const DEFAULT_STATIONS: MoveRaceStation[] = [
  { name: 'Trạm 1', location: 'Tòa B6', manager: 'Olivia Rhye', points: '10' },
  { name: 'Trạm 2', location: 'Sân sau Tòa A4', manager: 'Phoenix Baker', points: '10' },
]

const DEFAULT_TEAMS: MoveNameMissionRow[] = [
  { name: 'Đội 1', mission: 'Nhiệm vụ 1' },
  { name: 'Đội 2', mission: 'Nhiệm vụ 2' },
]

const DEFAULT_ORGANIZERS: MoveNameMissionRow[] = [
  { name: 'Ban hỗ trợ 1', mission: 'Điều phối trạm đầu vào' },
  { name: 'Ban hỗ trợ 2', mission: 'Giám sát vòng thi' },
]

const DEFAULT_RACE_SETTINGS: MoveNameMissionRow[] = [
  { name: 'Leaderboard', mission: 'Ẩn bảng xếp hạng trong 30 phút đầu' },
  { name: 'Checkpoint bonus', mission: 'Tặng 5 điểm cho đội đến đúng giờ' },
]

export const createDefaultRaceDraft = (): Pick<{
  imageName: string
  stations: MoveRaceStation[]
  teams: MoveNameMissionRow[]
  organizers: MoveNameMissionRow[]
  settingsRows: MoveNameMissionRow[]
}, 'imageName' | 'stations' | 'teams' | 'organizers' | 'settingsRows'> => ({
  imageName: '',
  stations: [...DEFAULT_STATIONS],
  teams: [...DEFAULT_TEAMS],
  organizers: [...DEFAULT_ORGANIZERS],
  settingsRows: [...DEFAULT_RACE_SETTINGS],
})
