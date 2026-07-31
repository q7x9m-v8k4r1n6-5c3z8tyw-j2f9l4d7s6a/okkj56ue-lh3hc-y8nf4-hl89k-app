import { useEffect, useRef, useState } from 'react'
import { useLocation, useMatches, useNavigate } from 'react-router-dom'
import { useAuthSession, useLogout } from '@/core/features/auth'
import { useRaceDetailQuery } from '@/core/features/race/edit-race/model/server/useRaceDetailQuery'
import { navigationConfig } from './navigation.config'

const pageItems = Object.values(navigationConfig)

/** Combines layout-only browser state with the authenticated session view. */
export const useAppLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const matches = useMatches()
  const { user } = useAuthSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { isLoggingOut, logout } = useLogout()
  const raceId = /^\/races\/([^/]+)$/.exec(location.pathname)?.[1]
  const raceDetail = useRaceDetailQuery(raceId)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const togglePanel = () => setIsPanelCollapsed((prev) => !prev)

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
    returnToNavigation: () => {
      setIsProfileOpen(false)
      navigate('/organizer/select')
    },
    setIsProfileOpen,
    title: raceDetail.data?.raceName
      ? `Chi tiết: ${raceDetail.data.raceName}`
      : matchTitle
      ?? pageItems.find(({ to }) => to === location.pathname)?.title
      ?? 'Move',
    user,
    isPanelCollapsed,
    togglePanel
  }
}