import { createBrowserRouter } from 'react-router-dom'
import App from '@/src/app/App'
import {
  AdminRoute,
  OrganizerRoute,
  ProtectedRoute,
  TeamRoute,
} from './protected-routes'

export const router = createBrowserRouter([
  {
    path: 'login',
    lazy: async () => {
      const { LoginPage } = await import('@/src/app/pages/login')
      return { Component: LoginPage }
    },
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <TeamRoute />,
        children: [
          {
            path: 'team',
            handle: { title: 'Đội chơi' },
            lazy: async () => {
              const { TeamRaceListPage } = await import('@/src/app/pages/team-race-list')
              return { Component: TeamRaceListPage }
            },
          },
          {
            path: 'team/races/:raceId',
            handle: { title: 'Chi tiết trận đấu' },
            lazy: async () => {
              const { TeamDetailRacePage } = await import('@/src/app/pages/team-detail-race')
              return { Component: TeamDetailRacePage }
            },
          },
        ],
      },
      {
        element: <OrganizerRoute />,
        children: [
          {
            path: 'organizer/select',
            handle: { title: 'Chọn khu vực làm việc' },
            lazy: async () => {
              const { OrganizerEntryPage } = await import('@/src/app/pages/organizer-entry')
              return { Component: OrganizerEntryPage }
            },
          },
          {
            path: 'organizer',
            handle: { title: 'Quản trạm' },
            lazy: async () => {
              const { OrganizerRaceListPage } = await import('@/src/app/pages/organizer-race-list')
              return { Component: OrganizerRaceListPage }
            },
          },
          {
            path: 'organizer/races/:raceId',
            handle: { title: 'Chi tiết trận đấu' },
            lazy: async () => {
              const { OrganizerRacePage } = await import('@/src/app/pages/organizer-race')
              return { Component: OrganizerRacePage }
            },
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            element: <App />,
            children: [
              {
                index: true,
                handle: { title: 'Danh sách trận đấu' },
                lazy: async () => {
                  const { RaceListPage } = await import('@/src/app/pages/race-list')
                  return { Component: RaceListPage }
                },
              },
              {
                path: 'races/new',
                handle: { title: 'Tạo trận đấu mới' },
                lazy: async () => {
                  const { CreateRacePage } = await import('@/src/app/pages/create-race')
                  return { Component: CreateRacePage }
                },
              },
              {
                path: 'races/:raceId',
                handle: { title: 'Chi tiết trận đấu' },
                lazy: async () => {
                  const { DetailRacePage } = await import('@/src/app/pages/detail-race')
                  return { Component: DetailRacePage }
                },
              },
              {
                path: 'users',
                handle: { title: 'Người dùng' },
                lazy: async () => {
                  const { UserListPage } = await import('@/src/app/pages/user-list')
                  return { Component: UserListPage }
                },
              },
              {
                path: 'settings',
                handle: { title: 'Cài đặt' },
                lazy: async () => {
                  const { SettingsPage } = await import('@/src/app/pages/settings')
                  return { Component: SettingsPage }
                },
              },
              {
                path: 'prototype',
                handle: { title: 'Common UI Prototype' },
                lazy: async () => {
                  const { PrototypePage } = await import('@/src/app/pages/prototype')
                  return { Component: PrototypePage }
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    lazy: async () => {
      const { NotFoundPage } = await import('@/src/app/pages/not-found')
      return { Component: NotFoundPage }
    },
  },
])
