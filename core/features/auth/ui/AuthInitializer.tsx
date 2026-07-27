import type { ReactNode } from 'react'
import { LoadingScreen } from '@/core/shared'
import { useAuthClientRecovery } from '../model/server/useAuthClientRecovery'
import { useRestoreAuthSession } from '../model/server/useRestoreAuthSession'

/** Blocks protected application rendering until session restoration finishes. */
export const AuthInitializer = ({ children }: { children: ReactNode }) => {
  useAuthClientRecovery()
  const { isInitialized } = useRestoreAuthSession()
  if (!isInitialized) {
    return <LoadingScreen text="Đang tải dữ liệu hệ thống..." />
  }
  return <>{children}</>
}
