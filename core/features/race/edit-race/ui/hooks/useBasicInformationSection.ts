import { useId, type ChangeEvent } from 'react'
import { useEditRaceForm } from '../../model/frontend/useEditRaceForm'

export const useBasicInformationSection = () => {
  const editor = useEditRaceForm()
  const coverInputId = useId()

  return {
    coverFileName: editor.form.coverFileName,
    coverInputId,
    coverUrl: editor.coverPreviewUrl || editor.form.coverUrl,
    errors: editor.errors,
    isEditing: editor.isEditing,
    onCoverFileChange: (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) editor.selectCoverFile(file)
    },
    onPlaceChange: (event: ChangeEvent<HTMLInputElement>) =>
      editor.updateBasic({ place: event.target.value }),
    onRaceNameChange: (event: ChangeEvent<HTMLInputElement>) =>
      editor.updateBasic({ raceName: event.target.value }),
    onRulesChange: (content: string) => 
      editor.updateBasic({ rules: content }),
    onTimeEndChange: (event: ChangeEvent<HTMLInputElement>) =>
      editor.updateBasic({ timeEnd: event.target.value }),
    onTimeStartChange: (event: ChangeEvent<HTMLInputElement>) =>
      editor.updateBasic({ timeStart: event.target.value }),
    place: editor.form.place,
    raceName: editor.form.raceName,
    rules: editor.form.rules ?? '',
    timeEnd: editor.form.timeEnd,
    timeStart: editor.form.timeStart,
  }
}