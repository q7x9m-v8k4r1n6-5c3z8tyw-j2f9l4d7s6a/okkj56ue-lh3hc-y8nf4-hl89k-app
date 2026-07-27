import { useDispatch, useSelector } from 'react-redux'
import type { AuthSessionState } from '../authSession.slice'

type AuthStoreState = {
  auth: AuthSessionState
}

/** Returns the dispatcher used by authentication session workflows. */
export const useAuthDispatch = () => useDispatch()

/** Selects the authentication session without coupling the feature to the app store. */
export const useAuthSession = () => (
  useSelector((state: AuthStoreState) => state.auth)
)
