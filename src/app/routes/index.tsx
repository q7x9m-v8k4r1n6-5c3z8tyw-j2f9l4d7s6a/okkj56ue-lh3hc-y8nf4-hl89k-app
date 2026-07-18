import { createBrowserRouter } from 'react-router-dom'
import App from '@/src/app/App'
import { ProtectedRoute } from './protected-routes'
import {
  NotFoundPage,
  PrototypePage,
  CreateRacePage,
  RaceListPage,
  UserListPage,
  LoginPage
} from '@/core/pages'

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  {
    path: 'login',
    element: <LoginPage />, 
  },

  // --- PRIVATE ROUTES (Phải có Token mới vào được) ---
  {
    element: <ProtectedRoute />, 
    children: [
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
    ],
  },

  // --- CATCH ALL (ERROR 404) ---
  {
    path: '*',
    element: <NotFoundPage />,
  },
])