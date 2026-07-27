import { useEffect } from 'react'
import {
  getGoogleIdentityApi,
  type GoogleCredentialResponse,
} from '../../model/frontend/googleIdentity'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
let initializedContainer: HTMLElement | null = null

/** Mounts the Google Identity button when its asynchronous script is ready. */
export const useGoogleLoginButton = (
  onCredential: (credential: string) => void,
  onConfigurationError: () => void,
) => {
  useEffect(() => {
    let isDisposed = false
    let retryTimer: number | undefined

    const initialize = () => {
      if (isDisposed) return
      const google = getGoogleIdentityApi()
      const container = document.getElementById('googleSignInBtn')
      if (!google || !container) {
        retryTimer = window.setTimeout(initialize, 100)
        return
      }
      if (!GOOGLE_CLIENT_ID) {
        onConfigurationError()
        return
      }

      // React StrictMode can mount the login view twice in development. The
      // Google Identity SDK only allows one initialize call per button.
      if (initializedContainer === container) return

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: GoogleCredentialResponse) => {
          onCredential(response.credential)
        },
      })
      container.replaceChildren()
      initializedContainer = container
      google.accounts.id.renderButton(container, {
        theme: 'outline',
        size: 'large',
        width: '380',
      })
    }

    initialize()
    return () => {
      isDisposed = true
      if (retryTimer !== undefined) window.clearTimeout(retryTimer)
    }
  }, [onConfigurationError, onCredential])
}
