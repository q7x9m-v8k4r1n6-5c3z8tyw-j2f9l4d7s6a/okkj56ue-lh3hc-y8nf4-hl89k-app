import { createBrowserRouter } from 'react-router-dom'
import { Move2026AppShell, Move2026HomePage } from '@plugin/move2026'
import App from '../App'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <Move2026AppShell />,
        children: [
          {
            index: true,
            element: <Move2026HomePage />,
          },
          {
            path: 'users',
            element: <section aria-label="Người dùng" className="min-h-[calc(100svh-61px)] bg-white" />,
          },
          {
            path: 'settings',
            element: <section aria-label="Cài đặt" className="min-h-[calc(100svh-61px)] bg-white" />,
          },
        ],
      },
    ],
  },
])
