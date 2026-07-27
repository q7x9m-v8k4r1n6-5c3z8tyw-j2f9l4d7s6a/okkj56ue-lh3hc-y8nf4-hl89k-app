import { UserForm } from './UserForm/UserForm'
import { useUserFormPanel } from './hooks/useUserFormPanel'

/**
 * Mounts the create/edit drawer when the user-list URL requests an editor.
 */
export const UserFormPanel = () => {
  const { formProps } = useUserFormPanel()
  return formProps ? <UserForm {...formProps} /> : null
}
