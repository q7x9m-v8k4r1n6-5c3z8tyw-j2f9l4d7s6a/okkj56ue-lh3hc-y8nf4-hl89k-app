import { useState } from 'react'
import { useAdminSecretMissionOverviewQuery } from '../../model/server/useAdminSecretMissionQueries'
import {
  useCreateSecretMissionMutation,
  useUpdateSecretMissionMutation,
  useDeleteSecretMissionMutation,
} from '../../model/server/useCreateSecretMissionMutation'
import type { AdminSecretMissionOverviewItem } from '../../model/adminSecretMission.contract'

export type MissionFormValues = {
  teamId: string
  name: string
  description: string
}

export const useAdminSecretMissionListView = (raceId?: string) => {
  const overviewQuery = useAdminSecretMissionOverviewQuery(raceId)
  const createMutation = useCreateSecretMissionMutation(raceId)
  const updateMutation = useUpdateSecretMissionMutation(raceId)
  const deleteMutation = useDeleteSecretMissionMutation(raceId)

  const [editingMission, setEditingMission] = useState<AdminSecretMissionOverviewItem | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)

  const openCreateDrawer = () => {
    setEditingMission(null)
    setIsDrawerOpen(true)
  }

  const openEditDrawer = (mission: AdminSecretMissionOverviewItem) => {
    setEditingMission(mission)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditingMission(null)
    createMutation.reset()
    updateMutation.reset()
  }

  const handleSubmit = (values: MissionFormValues) => {
    if (editingMission) {
      updateMutation.mutate(
        { missionId: editingMission.id, payload: values },
        { onSuccess: closeDrawer },
      )
      return
    }

    if (!raceId) return
    createMutation.mutate({ ...values, raceId }, { onSuccess: closeDrawer })
  }

  const handleDelete = (missionId: string) => {
    deleteMutation.mutate(missionId)
  }

  const submitError = editingMission ? updateMutation.error : createMutation.error

  return {
    missions: overviewQuery.data ?? [],
    isLoading: overviewQuery.isLoading,
    isError: overviewQuery.isError,

    isDrawerOpen,
    editingMission,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    submitErrorMessage: submitError instanceof Error ? submitError.message : '',

    handleDelete,
    isDeleting: deleteMutation.isPending,

    selectedMissionId,
    openDetail: (missionId: string) => setSelectedMissionId(missionId),
    closeDetail: () => setSelectedMissionId(null),
  }
}