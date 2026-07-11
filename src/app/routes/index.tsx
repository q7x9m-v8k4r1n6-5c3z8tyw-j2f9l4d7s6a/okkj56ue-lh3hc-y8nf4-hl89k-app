import { createBrowserRouter } from 'react-router-dom'
import App from '@/src/app/App'
import {
  NotFoundPage,
  PrototypePage,
  RaceDetailPage,
  RaceFormPage,
  RaceListPage,
  SettingsPage,
  UserFormPage,
  UserPage,
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
        element: <RaceFormPage mode="create" />,
        handle: { title: 'Tạo trận đấu mới' },
      },
      {
        path: 'races/:raceId',
        element: <RaceDetailPage />,
        handle: { title: 'Chi tiết trận đấu' },
      },
      {
        path: 'races/:raceId/edit',
        element: <RaceFormPage mode="edit" />,
        handle: { title: 'Chỉnh sửa trận đấu' },
      },
      {
        path: 'users',
        element: <UserPage />,
        handle: { title: 'Người dùng' },
      },
      {
        path: 'users/teams/new',
        element: <UserFormPage category="team" mode="create" />,
        handle: { title: 'Thêm đội chơi mới' },
      },
      {
        path: 'users/staff/new',
        element: <UserFormPage category="staff" mode="create" />,
        handle: { title: 'Thêm mới Ban Tổ chức' },
      },
      {
        path: 'users/teams/:userId/edit',
        element: <UserFormPage category="team" mode="edit" />,
        handle: { title: 'Chỉnh sửa đội chơi' },
      },
      {
        path: 'users/staff/:userId/edit',
        element: <UserFormPage category="staff" mode="edit" />,
        handle: { title: 'Chỉnh sửa Ban Tổ chức' },
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        handle: { title: 'Cài đặt' },
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
