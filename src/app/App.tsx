import { Outlet } from 'react-router-dom'
import { AppLayout } from '@/core/widgets/app-layout'

function App() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default App
