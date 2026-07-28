import { useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/core/shared'
import {
  getEditRaceErrorMessage,
  isEditRaceConflict,
} from '../../model/frontend/editRace.error'
import { useEditRaceForm } from '../../model/frontend/useEditRaceForm'
import { mapEditRaceFormToRequest } from '../../model/mapEditRaceFormToRequest'
import { mapRaceDetailToForm } from '../../model/mapRaceDetailToForm'
import { editRaceQueryKeys } from '../../model/server/editRace.queryKeys'
import { usePatchRaceMutation } from '../../model/server/usePatchRaceMutation'
import type { EditRaceStatus } from '../../model/editRace.contract'

/**
 * Coordinates frontend form state with the PATCH mutation.
 *
 * Components consume this view-model and do not need to know how payload
 * mapping, validation, cache refresh, or conflict recovery works.
 */
export const useEditRaceEditor = (raceId?: string) => {
  const editor = useEditRaceForm()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const patchMutation = usePatchRaceMutation(raceId)

  /** Sends the current form and optionally changes the race status. */
  const submit = (
    status?: EditRaceStatus,
    shouldValidate = true,
  ) => {
    if (shouldValidate && !editor.validateForSave()) return

    patchMutation.mutate(
      {
        coverFile: editor.coverFile,
        payload: mapEditRaceFormToRequest(
          editor.form,
          editor.originalForm,
          status,
        ),
      },
      {
        onSuccess: (detail) => {
          editor.finishEditing(mapRaceDetailToForm(detail))
          toast({
            title: 'Đã lưu thay đổi thành công.',
            variant: 'success',
          })
        },
      },
    )
  }

  /**
   * Discards the stale local baseline and reloads the latest server version
   * after an optimistic-concurrency conflict.
   */
  const reloadLatestVersion = () => {
    editor.cancelEditing()
    patchMutation.reset()
    void queryClient.invalidateQueries({
      queryKey: editRaceQueryKeys.detail(raceId),
    })
  }

  const conflict = isEditRaceConflict(patchMutation.error)

  return {
    errorMessage: patchMutation.error
      ? getEditRaceErrorMessage(
        patchMutation.error,
        'Không thể lưu thay đổi.',
      )
      : '',
    isConflict: conflict,
    reloadLatestVersion,
    ribbon: {
      actionsDisabled: !raceId,
      isEditing: editor.isEditing,
      isSaving: patchMutation.isPending,
      modifiedAt: editor.form.modifiedAt,
      onCancel: editor.cancelEditing,
      onEdit: editor.startEditing,
      onEnd: () => submit('completed', false),
      onPause: () => submit('paused', false),
      onPublish: () => submit('ready', false),
      onResume: () => submit('ongoing', false),
      onSave: () => submit(),
      onStart: () => submit('ongoing', false),
      saveDisabled: !editor.isDirty,
      status: editor.form.status,
    },
  }
}
