export type RaceStatus = 'upcoming' | 'live' | 'done'
export type UserCategory = 'team' | 'staff'
export type UserStatus = 'active' | 'inactive'
export type StaffRole = 'admin' | 'coordinator' | 'support'

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

export type MoveRaceRecord = {
  id: number
  name: string
  location: string
  startAt: string
  endAt: string
  startText: string
  endText: string
  members: number
  status: RaceStatus
  duration: number
  imageName: string
  stations: MoveRaceStation[]
  teams: MoveNameMissionRow[]
  organizers: MoveNameMissionRow[]
  settingsRows: MoveNameMissionRow[]
}

export type MoveUserRecord = {
  id: number
  category: UserCategory
  displayName: string
  username: string
  password: string
  email: string
  role: StaffRole | ''
  status: UserStatus
  inviteEmail: boolean
  note: string
}

export type MoveSettingsState = {
  leaderboardVisible: boolean
}

const RACE_STORAGE_KEY = 'move2026-race-records-v3'
const USER_STORAGE_KEY = 'move2026-user-records-v4'
const SETTINGS_STORAGE_KEY = 'move2026-settings-v1'
const MOVE_DEFAULT_PASSWORD = 'Mymycute'
const CURRENT_YEAR = new Date().getFullYear()

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

const SEED_RACES = [
  { id: 1, name: 'Spring Hackathon 2024', location: 'Main Hall', startAt: `${CURRENT_YEAR}-03-15T08:00`, endAt: `${CURRENT_YEAR}-03-17T18:00`, members: 124, status: 'live' as const, duration: 3480 },
  { id: 2, name: 'Volunteer Marathon 2024', location: 'Campus Yard', startAt: `${CURRENT_YEAR}-03-18T09:00`, endAt: `${CURRENT_YEAR}-03-18T17:00`, members: 98, status: 'upcoming' as const, duration: 480 },
  { id: 3, name: 'MOVE Campus Relay', location: 'Innovation Center', startAt: `${CURRENT_YEAR}-03-20T07:30`, endAt: `${CURRENT_YEAR}-03-20T12:00`, members: 76, status: 'upcoming' as const, duration: 270 },
  { id: 4, name: 'Leadership Sprint', location: 'Meeting Room A', startAt: `${CURRENT_YEAR}-03-12T08:30`, endAt: `${CURRENT_YEAR}-03-12T16:30`, members: 64, status: 'done' as const, duration: 480 },
  { id: 5, name: 'Community Fair', location: 'Outdoor Plaza', startAt: `${CURRENT_YEAR}-03-08T10:00`, endAt: `${CURRENT_YEAR}-03-08T15:00`, members: 51, status: 'done' as const, duration: 300 },
  { id: 6, name: 'Innovation Camp', location: 'Block B', startAt: `${CURRENT_YEAR}-03-25T09:00`, endAt: `${CURRENT_YEAR}-03-26T17:00`, members: 112, status: 'upcoming' as const, duration: 1920 },
  { id: 7, name: 'Green Campus Run', location: 'South Gate', startAt: `${CURRENT_YEAR}-03-28T06:30`, endAt: `${CURRENT_YEAR}-03-28T11:30`, members: 143, status: 'upcoming' as const, duration: 300 },
  { id: 8, name: 'Volunteer Summit', location: 'Conference Hall', startAt: `${CURRENT_YEAR}-03-30T08:30`, endAt: `${CURRENT_YEAR}-03-30T17:30`, members: 89, status: 'done' as const, duration: 540 },
  { id: 9, name: 'MOVE Expo Day', location: 'Exhibition Center', startAt: `${CURRENT_YEAR}-04-01T09:00`, endAt: `${CURRENT_YEAR}-04-01T18:00`, members: 132, status: 'upcoming' as const, duration: 540 },
  { id: 10, name: 'Creative Pitch Night', location: 'Studio Hall', startAt: `${CURRENT_YEAR}-04-02T18:00`, endAt: `${CURRENT_YEAR}-04-02T21:00`, members: 41, status: 'done' as const, duration: 180 },
]

const BASE_TEAM_ROWS = [
  { id: 1, category: 'team' as const, displayName: 'Olivia Rhye', username: 'olivia', email: 'olivia@untitledui.com' },
  { id: 2, category: 'team' as const, displayName: 'Phoenix Baker', username: 'phoenix', email: 'phoenix@untitledui.com' },
  { id: 3, category: 'team' as const, displayName: 'Lana Steiner', username: 'lana', email: 'lana@untitledui.com' },
  { id: 4, category: 'team' as const, displayName: 'Demi Wilkinson', username: 'demi', email: 'demi@untitledui.com' },
  { id: 5, category: 'team' as const, displayName: 'Candice Wu', username: 'candice', email: 'candice@untitledui.com' },
  { id: 6, category: 'team' as const, displayName: 'Natali Craig', username: 'natali', email: 'natali@untitledui.com' },
  { id: 7, category: 'team' as const, displayName: 'Drew Cano', username: 'drew', email: 'drew@untitledui.com' },
  { id: 8, category: 'team' as const, displayName: 'Orlando Diggs', username: 'orlando', email: 'orlando@untitledui.com' },
  { id: 9, category: 'team' as const, displayName: 'Andi Lane', username: 'andi', email: 'andi@untitledui.com' },
  { id: 10, category: 'team' as const, displayName: 'Kate Morrison', username: 'kate', email: 'kate@untitledui.com' },
]

const EXTRA_TEAM_FIRST_NAMES = [
  'Avery', 'Blake', 'Cameron', 'Dakota', 'Elliot', 'Finley', 'Harper', 'Jordan', 'Kai', 'Logan',
  'Morgan', 'Nova', 'Parker', 'Quinn', 'Rowan', 'Sawyer', 'Taylor', 'Val', 'Winter', 'Zion',
]

const EXTRA_TEAM_LAST_NAMES = ['Hughes', 'Brooks', 'Pierce', 'Hayes', 'Dean', 'Frost', 'Reed', 'Cole', 'Banks', 'Shaw']

const BASE_STAFF_ROWS = [
  { id: 1, category: 'staff' as const, displayName: 'Admin Move', username: 'adminmove', email: 'admin.move@untitledui.com', role: 'admin' as const, status: 'active' as const },
  { id: 2, category: 'staff' as const, displayName: 'Theo Nguyen', username: 'theonguyen', email: 'theo@untitledui.com', role: 'coordinator' as const, status: 'active' as const },
  { id: 3, category: 'staff' as const, displayName: 'Linh Tran', username: 'linhtran', email: 'linh@untitledui.com', role: 'coordinator' as const, status: 'inactive' as const },
  { id: 4, category: 'staff' as const, displayName: 'Jenny Wilson', username: 'jennywilson', email: 'jenny@untitledui.com', role: 'support' as const, status: 'active' as const },
  { id: 5, category: 'staff' as const, displayName: 'Wade Warren', username: 'wadewarren', email: 'wade@untitledui.com', role: 'admin' as const, status: 'active' as const },
  { id: 6, category: 'staff' as const, displayName: 'Kristin Watson', username: 'kristinwatson', email: 'kristin@untitledui.com', role: 'support' as const, status: 'inactive' as const },
  { id: 7, category: 'staff' as const, displayName: 'Savannah Nguyen', username: 'savannahnguyen', email: 'savannah@untitledui.com', role: 'coordinator' as const, status: 'active' as const },
  { id: 8, category: 'staff' as const, displayName: 'Cody Fisher', username: 'codyfisher', email: 'cody@untitledui.com', role: 'support' as const, status: 'active' as const },
]

const EXTRA_TEAM_ROWS = EXTRA_TEAM_FIRST_NAMES.flatMap((firstName) => EXTRA_TEAM_LAST_NAMES.map((lastName) => ({
  firstName,
  lastName,
}))).slice(0, 90).map((entry, index) => {
  const username = `${entry.firstName}${entry.lastName}`.toLowerCase()

  return {
    id: index + 11,
    category: 'team' as const,
    displayName: `${entry.firstName} ${entry.lastName}`,
    username,
    email: `${username}@untitledui.com`,
    status: index % 9 === 0 ? 'inactive' as const : 'active' as const,
  }
})

const isBrowser = () => typeof window !== 'undefined'

const pad = (value: number) => String(value).padStart(2, '0')
const sanitize = (value: unknown) => String(value ?? '').trim()

const formatDateTimeForDisplay = (date: Date) => `${pad(date.getDate())}/${pad(date.getMonth() + 1)}, ${pad(date.getHours())}:${pad(date.getMinutes())}`

const formatDateTimeFromIso = (isoValue: string) => {
  const date = new Date(isoValue)
  return Number.isNaN(date.getTime()) ? '' : formatDateTimeForDisplay(date)
}

const normalizeRaceStatus = (value: unknown): RaceStatus => value === 'done' || value === 'live' ? value : 'upcoming'
const normalizeUserStatus = (value: unknown): UserStatus => value === 'inactive' ? 'inactive' : 'active'
const normalizeUserCategory = (value: unknown): UserCategory => value === 'staff' ? 'staff' : 'team'
const normalizeRole = (value: unknown, category: UserCategory): StaffRole | '' => {
  if (category !== 'staff') return ''
  if (value === 'admin' || value === 'support') return value
  return 'coordinator'
}

const normalizeStationRows = (rows: unknown): MoveRaceStation[] => Array.isArray(rows)
  ? rows.map((row) => ({
    name: sanitize((row as Partial<MoveRaceStation>)?.name),
    location: sanitize((row as Partial<MoveRaceStation>)?.location),
    manager: sanitize((row as Partial<MoveRaceStation>)?.manager),
    points: sanitize((row as Partial<MoveRaceStation>)?.points),
  })).filter((row) => row.name || row.location || row.manager || row.points)
  : []

const normalizeNameMissionRows = (rows: unknown): MoveNameMissionRow[] => Array.isArray(rows)
  ? rows.map((row) => ({
    name: sanitize((row as Partial<MoveNameMissionRow>)?.name),
    mission: sanitize((row as Partial<MoveNameMissionRow>)?.mission),
  })).filter((row) => row.name || row.mission)
  : []

const normalizeRaceRecord = (row: Partial<MoveRaceRecord>): MoveRaceRecord => {
  const startAt = sanitize(row.startAt)
  const endAt = sanitize(row.endAt)

  return {
    id: Number(row.id) || 0,
    name: sanitize(row.name),
    location: sanitize(row.location),
    startAt,
    endAt,
    startText: sanitize(row.startText) || formatDateTimeFromIso(startAt),
    endText: sanitize(row.endText) || formatDateTimeFromIso(endAt),
    members: Number(row.members) || 0,
    status: normalizeRaceStatus(row.status),
    duration: Number(row.duration) || 120,
    imageName: sanitize(row.imageName),
    stations: normalizeStationRows(row.stations),
    teams: normalizeNameMissionRows(row.teams),
    organizers: normalizeNameMissionRows(row.organizers),
    settingsRows: normalizeNameMissionRows(row.settingsRows),
  }
}

const normalizeUserRecord = (row: Partial<MoveUserRecord>): MoveUserRecord => {
  const category = normalizeUserCategory(row.category)

  return {
    id: Number(row.id) || 0,
    category,
    displayName: sanitize(row.displayName),
    username: sanitize(row.username),
    password: sanitize(row.password) || MOVE_DEFAULT_PASSWORD,
    email: sanitize(row.email),
    role: normalizeRole(row.role, category),
    status: normalizeUserStatus(row.status),
    inviteEmail: Boolean(row.inviteEmail),
    note: sanitize(row.note),
  }
}

const readStorageArray = <TValue,>(key: string): TValue[] | null => {
  if (!isBrowser()) return null

  try {
    const rawValue = window.localStorage.getItem(key)
    if (rawValue === null) return null
    const parsedValue = JSON.parse(rawValue) as unknown
    return Array.isArray(parsedValue) ? parsedValue as TValue[] : null
  } catch {
    return null
  }
}

const writeStorageValue = (key: string, value: unknown) => {
  if (!isBrowser()) return false

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

const createSeedRace = (row: typeof SEED_RACES[number]): MoveRaceRecord => normalizeRaceRecord({
  ...row,
  imageName: '',
  startText: formatDateTimeFromIso(row.startAt),
  endText: formatDateTimeFromIso(row.endAt),
  stations: DEFAULT_STATIONS,
  teams: DEFAULT_TEAMS,
  organizers: DEFAULT_ORGANIZERS,
  settingsRows: DEFAULT_RACE_SETTINGS,
})

const createSeedUser = (
  row: {
    id: number
    category: UserCategory
    displayName: string
    username: string
    email: string
    role?: StaffRole
    status?: UserStatus
  },
): MoveUserRecord => normalizeUserRecord({
  ...row,
  password: MOVE_DEFAULT_PASSWORD,
  status: row.status ?? 'active',
  role: row.role ?? '',
  inviteEmail: false,
  note: '',
})

const seedRaces = () => SEED_RACES.map(createSeedRace)
const seedUsers = () => [...BASE_TEAM_ROWS, ...EXTRA_TEAM_ROWS, ...BASE_STAFF_ROWS].map(createSeedUser)

export const getRaceRecords = () => {
  const storedRows = readStorageArray<MoveRaceRecord>(RACE_STORAGE_KEY)

  if (storedRows) {
    return storedRows.map(normalizeRaceRecord)
  }

  const rows = seedRaces()
  writeStorageValue(RACE_STORAGE_KEY, rows)
  return rows
}

export const getRaceRecord = (raceId: string | number) =>
  getRaceRecords().find((row) => String(row.id) === String(raceId)) ?? null

export const saveRaceRecord = (row: Partial<MoveRaceRecord>, mode: 'create' | 'edit') => {
  const rows = getRaceRecords()
  const normalizedRow = normalizeRaceRecord(row)

  if (mode === 'edit') {
    const rowIndex = rows.findIndex((item) => String(item.id) === String(normalizedRow.id))
    if (rowIndex === -1) return null
    rows[rowIndex] = normalizedRow
    return writeStorageValue(RACE_STORAGE_KEY, rows) ? normalizedRow : null
  }

  normalizedRow.id = rows.reduce((maxValue, item) => Math.max(maxValue, item.id), 0) + 1
  rows.unshift(normalizedRow)
  return writeStorageValue(RACE_STORAGE_KEY, rows) ? normalizedRow : null
}

export const getUserRecords = () => {
  const storedRows = readStorageArray<MoveUserRecord>(USER_STORAGE_KEY)

  if (storedRows) {
    return storedRows.map(normalizeUserRecord)
  }

  const rows = seedUsers()
  writeStorageValue(USER_STORAGE_KEY, rows)
  return rows
}

export const getUserRecord = (category: UserCategory, userId: string | number) =>
  getUserRecords().find((row) => row.category === category && String(row.id) === String(userId)) ?? null

export const saveUserRecord = (row: Partial<MoveUserRecord>, mode: 'create' | 'edit') => {
  const rows = getUserRecords()
  const normalizedRow = normalizeUserRecord(row)

  if (mode === 'edit') {
    const rowIndex = rows.findIndex((item) => item.category === normalizedRow.category && item.id === normalizedRow.id)
    if (rowIndex === -1) return null
    rows[rowIndex] = normalizedRow
    return writeStorageValue(USER_STORAGE_KEY, rows) ? normalizedRow : null
  }

  normalizedRow.id = rows
    .filter((item) => item.category === normalizedRow.category)
    .reduce((maxValue, item) => Math.max(maxValue, item.id), 0) + 1
  rows.unshift(normalizedRow)
  return writeStorageValue(USER_STORAGE_KEY, rows) ? normalizedRow : null
}

export const deleteUserRecord = (category: UserCategory, userId: string | number) => {
  const rows = getUserRecords()
  const rowIndex = rows.findIndex((row) => row.category === category && String(row.id) === String(userId))

  if (rowIndex === -1) return false

  rows.splice(rowIndex, 1)
  return writeStorageValue(USER_STORAGE_KEY, rows)
}

export const getMoveSettings = (): MoveSettingsState => {
  if (!isBrowser()) return { leaderboardVisible: false }

  try {
    const rawValue = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    const parsed = rawValue ? JSON.parse(rawValue) as Partial<MoveSettingsState> : {}

    return {
      leaderboardVisible: Boolean(parsed.leaderboardVisible),
    }
  } catch {
    return { leaderboardVisible: false }
  }
}

export const saveMoveSettings = (settings: MoveSettingsState) => writeStorageValue(SETTINGS_STORAGE_KEY, settings)

export const buildStaffIdentityFromEmail = (email: string) => {
  const localPart = sanitize(email).split('@')[0].toLowerCase()
  const username = localPart.replace(/[^a-z0-9._-]/g, '')
  const displayName = username
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b[a-z]/g, (character) => character.toUpperCase())

  return {
    username,
    displayName,
  }
}

export const validateUserUsername = (category: UserCategory, username: string) => {
  if (category === 'team' && !/^[a-z0-9-]+$/.test(username)) {
    return 'Username đội chơi chỉ gồm chữ thường, số hoặc dấu gạch nối.'
  }

  if (category === 'staff' && !/^[a-z0-9._-]+$/.test(username)) {
    return 'Username thành viên chỉ gồm chữ thường, số, dấu chấm, gạch nối hoặc gạch dưới.'
  }

  return ''
}

export const resolveRaceStatus = (startAt: string, endAt: string): RaceStatus => {
  const now = new Date()
  const startDate = new Date(startAt)
  const endDate = new Date(endAt)

  if (endDate < now) return 'done'
  if (startDate <= now && endDate >= now) return 'live'
  return 'upcoming'
}

export const getRaceProgress = (row: MoveRaceRecord) => {
  const totalChecks = Math.max(row.stations.length, 1)

  if (row.status === 'done') {
    return { percent: 100, completed: totalChecks, pending: 0 }
  }

  if (row.status === 'live') {
    const completed = Math.max(1, Math.min(totalChecks, Math.round(totalChecks * 0.65)))
    return {
      percent: Math.round((completed / totalChecks) * 100),
      completed,
      pending: Math.max(totalChecks - completed, 0),
    }
  }

  return { percent: 12, completed: 0, pending: totalChecks }
}

export const createDefaultRaceDraft = (): Pick<MoveRaceRecord, 'imageName' | 'stations' | 'teams' | 'organizers' | 'settingsRows'> => ({
  imageName: '',
  stations: [...DEFAULT_STATIONS],
  teams: [...DEFAULT_TEAMS],
  organizers: [...DEFAULT_ORGANIZERS],
  settingsRows: [...DEFAULT_RACE_SETTINGS],
})

export const formatDateTimeForStorage = (value: string) => formatDateTimeFromIso(value)
export { MOVE_DEFAULT_PASSWORD }
