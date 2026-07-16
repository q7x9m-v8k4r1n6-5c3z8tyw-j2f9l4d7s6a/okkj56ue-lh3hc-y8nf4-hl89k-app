import type { RaceDetailModel, RaceLifecycleStatus } from '../model'

const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * 60 * 60 * 1000).toISOString()
const addDays = (date: Date, days: number) => addHours(date, days * 24)

const SAMPLE_IDS = {
  upcoming: '11111111-1111-4111-8111-111111111111',
  ongoing: '22222222-2222-4222-8222-222222222222',
  completed: '33333333-3333-4333-8333-333333333333',
}

export type SampleRaceListItem = {
  id: string
  name: string
  place?: string
  timeStart?: string
  timeEnd?: string
  status: Exclude<RaceLifecycleStatus, undefined>
}

/**
 * Du lieu mau chi dung cho moi truong dev khi backend/database chua san sang.
 * Khong import file nay vao UI de tranh tron mock data voi giao dien that.
 */
export const isSampleRaceDataEnabled = () => import.meta.env.DEV && import.meta.env.VITE_DISABLE_SAMPLE_RACE_DATA !== 'true'

export const createSampleRaceDetails = (now = new Date()): RaceDetailModel[] => ([
  {
    id: SAMPLE_IDS.upcoming,
    name: 'OVC Move Spring Challenge',
    raceName: 'OVC Move Spring Challenge',
    place: 'Cong vien Gia Dinh, TP.HCM',
    timeStart: addDays(now, 3),
    timeEnd: addDays(now, 3.25),
    status: 'upcoming',
    coverUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5',
    isToggledLeaderboard: true,
    isHiddenPoint: false,
    organizerId: ['aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'],
    organizers: [
      {
        id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        organizerId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        displayName: 'Ban to chuc OVC',
        email: 'organizer@ovc.local',
      },
    ],
    raceTeam: [
      {
        id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        teamID: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        name: 'Team Alpha',
        email: 'alpha@team.local',
      },
      {
        id: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        teamID: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
        name: 'Team Beta',
        email: 'beta@team.local',
      },
    ],
    booth: [
      {
        id: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        boothId: 'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
        name: 'Tram xuat phat',
        place: 'Cong chinh',
        description: 'Kiem tra diem danh va phat so deo.',
        organizerId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      },
      {
        id: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        boothId: 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
        name: 'Tram thu thach',
        place: 'Khu san co',
        description: 'Thu thach van dong ngan cho cac doi.',
        organizerId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      },
    ],
  },
  {
    id: SAMPLE_IDS.ongoing,
    name: 'OVC Move City Race',
    raceName: 'OVC Move City Race',
    place: 'Quan 1, TP.HCM',
    timeStart: addHours(now, -2),
    timeEnd: addHours(now, 2),
    status: 'ongoing',
    isToggledLeaderboard: true,
    isHiddenPoint: true,
    raceTeam: [
      {
        id: '44444444-4444-4444-8444-444444444444',
        teamID: '44444444-4444-4444-8444-444444444444',
        name: 'Team Velocity',
        email: 'velocity@team.local',
      },
    ],
    booth: [
      {
        id: '55555555-5555-4555-8555-555555555555',
        boothId: '55555555-5555-4555-8555-555555555555',
        name: 'Tram trung tam',
        place: 'Pho di bo Nguyen Hue',
        description: 'Tram dieu phoi chinh trong race.',
      },
    ],
  },
  {
    id: SAMPLE_IDS.completed,
    name: 'OVC Move History Run',
    raceName: 'OVC Move History Run',
    place: 'Khu do thi Thu Thiem',
    timeStart: addDays(now, -7),
    timeEnd: addDays(now, -6.8),
    status: 'completed',
    isToggledLeaderboard: false,
    isHiddenPoint: false,
    raceTeam: [
      {
        id: '66666666-6666-4666-8666-666666666666',
        teamID: '66666666-6666-4666-8666-666666666666',
        name: 'Team Legacy',
        email: 'legacy@team.local',
      },
    ],
    booth: [
      {
        id: '77777777-7777-4777-8777-777777777777',
        boothId: '77777777-7777-4777-8777-777777777777',
        name: 'Tram dich',
        place: 'Quang truong trung tam',
        description: 'Ghi nhan doi hoan thanh cuoc dua.',
      },
    ],
  },
])

export const getSampleRaceList = (): SampleRaceListItem[] => {
  return createSampleRaceDetails().map((race) => ({
    id: race.id,
    name: race.name ?? race.raceName ?? '',
    place: race.place,
    timeStart: race.timeStart,
    timeEnd: race.timeEnd,
    status: race.status as Exclude<RaceLifecycleStatus, undefined>,
  }))
}

export const getSampleRaceDetail = (raceId: string): RaceDetailModel | undefined => {
  return createSampleRaceDetails().find((race) => race.id === raceId)
}
