import { useNavigate, useParams } from 'react-router-dom'
import type { UserFormProps } from '../../model/userForm'
import { useUserDetailQuery } from '../../model/server/useUserDetailQuery'

/** Resolves route/prop identity and owns edit-form detail server state. */
export const useUserFormView = ({
  category,
  mode,
  onClose,
  userId,
}: UserFormProps) => {
  const navigate = useNavigate()
  const { userId: routeUserId = '' } = useParams()
  const resolvedUserId = userId ?? routeUserId
  const canLoad = mode === 'edit'
    && resolvedUserId.length > 0
  const query = useUserDetailQuery(category, resolvedUserId, canLoad)

  return {
    close: () => {
      if (onClose) return onClose()
      navigate('/users', { state: { activeTab: category } })
    },
    initialForm: mode === 'create' ? undefined : query.data,
    isLoading: query.isLoading,
    isMissing: mode === 'edit' && !query.isLoading && !query.data,
  }
}
