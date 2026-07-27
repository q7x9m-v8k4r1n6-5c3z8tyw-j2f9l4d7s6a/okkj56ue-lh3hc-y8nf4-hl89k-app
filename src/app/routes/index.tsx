import { createBrowserRouter } from 'react-router-dom'
import App from '@/src/app/App'
import { ProtectedRoute } from './protected-routes'

export const router = createBrowserRouter([
  {
    path: 'login',
    lazy: async () => {
      const { LoginPage } = await import('@/core/pages/login')
      return { Component: LoginPage }
    },
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <App />,
        children: [
          {
            index: true,
            handle: { title: 'Danh sách trận đấu' },
            lazy: async () => {
              const { RaceListPage } = await import('@/core/pages/race-list')
              return { Component: RaceListPage }
            },
          },
          {
            path: 'races/new',
            handle: { title: 'Tạo trận đấu mới' },
            lazy: async () => {
              const { CreateRacePage } = await import('@/core/pages/create-race')
              return { Component: CreateRacePage }
            },
          },
          {
            path: 'races/:raceId',
            handle: { title: 'Chi tiết trận đấu' },
            lazy: async () => {
              const { DetailRacePage } = await import('@/core/pages/detail-race')
              return { Component: DetailRacePage }
            },
          },
          {
            path: 'users',
            handle: { title: 'Người dùng' },
            lazy: async () => {
              const { UserListPage } = await import('@/core/pages/user-list')
              return { Component: UserListPage }
            },
          },
          {
            path: 'prototype',
            handle: { title: 'Common UI Prototype' },
            lazy: async () => {
              const { PrototypePage } = await import('@/core/pages/prototype')
              return { Component: PrototypePage }
            },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    lazy: async () => {
      const { NotFoundPage } = await import('@/core/pages/not-found')
      return { Component: NotFoundPage }
    },
  },
])
