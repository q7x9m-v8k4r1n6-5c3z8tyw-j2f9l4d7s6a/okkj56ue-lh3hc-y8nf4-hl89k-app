import { createBrowserRouter } from 'react-router-dom'
import App from '@/src/app/App'
import {
  NotFoundPage,
  PrototypePage,
  CreateRacePage,
  EditRacePage,
  RaceDetailPage,
  RaceListPage,
  UserListPage,
} from '@/core/pages'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: <RaceListPage />,
        handle: { title: 'Danh sách trận đấu' },
      },
      {
        path: 'races/new',
        element: <CreateRacePage />,
        handle: { title: 'Tạo trận đấu mới' },
      },
      {
        path: 'races/:raceId',
        element: <RaceDetailPage />,
        handle: { title: 'Chi tiết giải đấu' },
      },
      {
        path: 'races/:raceId/edit',
        element: <EditRacePage />,
        handle: { title: 'Chỉnh sửa giải đấu' },
      },
      {
        path: 'users',
        element: <UserListPage />,
        handle: { title: 'Người dùng' },
      },
      {
        path: 'prototype',
        element: <PrototypePage />,
        handle: { title: 'Common UI Prototype' },
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
