import { useEffect, useRef, useState } from 'react'
import { useLocation, useMatches } from 'react-router-dom'
import { useAuthSession, useLogout } from '@/core/features/auth'
import { navigationConfig } from './navigation.config'

const pageItems = Object.values(navigationConfig)

const roleLabels: Record<string, string> = {
  admin: 'Quản trị viên',
  organizer: 'Ban tổ chức',
  team: 'Đội chơi',
}

/** Combines layout-only browser state with the authenticated session view. */
export const useAppLayout = () => {
  const location = useLocation()
  const matches = useMatches()
  const { user } = useAuthSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { isLoggingOut, logout } = useLogout()

  useEffect(() => {
    if (!isProfileOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isProfileOpen])

  const matchTitle = [...matches].reverse()
    .map((match) => (match.handle as { title?: string } | undefined)?.title)
    .find(Boolean)
  const displayName = user?.displayName?.trim()
    || user?.email
    || 'Người dùng'

  return {
    displayName,
    isLoggingOut,
    isProfileOpen,
    logout,
    navigationItems: pageItems.filter(({ hidden }) => !hidden),
    profileRef,
    roleLabel: roleLabels[user?.role ?? ''] ?? 'Thành viên',
    setIsProfileOpen,
    title: matchTitle
      ?? pageItems.find(({ to }) => to === location.pathname)?.title
      ?? 'Move',
    user,
  }
}
