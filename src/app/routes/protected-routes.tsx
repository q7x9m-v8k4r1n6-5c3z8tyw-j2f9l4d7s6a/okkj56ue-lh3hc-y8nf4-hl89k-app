import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store'

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  // Nếu chưa đăng nhập, đá văng ra trang login và xóa lịch sử route hiện tại
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Nếu đã đăng nhập, cho phép đi tiếp vào các route con bên trong (Outlet)
  return <Outlet />
}