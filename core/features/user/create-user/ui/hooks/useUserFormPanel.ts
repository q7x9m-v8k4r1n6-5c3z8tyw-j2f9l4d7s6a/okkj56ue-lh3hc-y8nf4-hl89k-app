import { useSearchParams } from 'react-router-dom'
import {
  clearUserEditorTarget,
  parseUserEditorTarget,
} from '../../../model/userEditorSearchParams'
import type { UserFormProps } from '../../model/userForm'

/** Reads and updates the URL contract shared by user-list and user-editor. */
export const useUserFormPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const target = parseUserEditorTarget(searchParams)

  const removeEditorParams = () => {
    setSearchParams(
      (current) => clearUserEditorTarget(current),
      { replace: true },
    )
  }

  const close = () => {
    removeEditorParams()
  }

  const formProps: UserFormProps | null = target
    ? {
      category: target.category,
      mode: target.mode,
      onClose: close,
      onSaved: close,
      open: true,
      userId: target.userId,
    }
    : null

  return { formProps }
}
