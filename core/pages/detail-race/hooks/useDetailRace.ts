import { useState } from 'react'
import { useEditRace } from '@/core/features/race/edit-race'
import { DETAIL_RACE_TABS } from '../constants'
import type { DetailRaceTab } from '../models'

export const useDetailRace = (raceId?: string) => {
  const [activeTab, setActiveTab] = useState<DetailRaceTab>('basic')
  const [isEditing, setIsEditing] = useState(false)
  const editRace = useEditRace(raceId)

  const handleSave = () => {
    editRace.saveRace({ onSuccess: () => setIsEditing(false) })
  }

  const handlePublish = () => {
    editRace.saveRace({ onSuccess: () => setIsEditing(false), status: 'ready' })
  }

  const handleStart = () => {
    editRace.saveRace({ onSuccess: () => setIsEditing(false), status: 'ongoing' })
  }

  const handlePause = () => {
    editRace.saveRace({ onSuccess: () => setIsEditing(false), status: 'paused' })
  }

  const handleResume = () => {
    editRace.saveRace({ onSuccess: () => setIsEditing(false), status: 'ongoing' })
  }

  const handleEnd = () => {
    editRace.saveRace({ onSuccess: () => setIsEditing(false), status: 'completed' })
  }

  return {
    activeTab,
    activeTabLabel: DETAIL_RACE_TABS.find((tab) => tab.value === activeTab)?.label ?? 'Nội dung',
    editRace,
    handleEnd,
    handlePause,
    handlePublish,
    handleResume,
    handleSave,
    handleStart,
    isEditing,
    setActiveTab,
    setIsEditing,
  }
}
