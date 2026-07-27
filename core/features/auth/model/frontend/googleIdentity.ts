export type GoogleCredentialResponse = {
  credential: string
}

type GoogleIdentityApi = {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string
        callback: (response: GoogleCredentialResponse) => void
      }) => void
      renderButton: (
        container: HTMLElement,
        options: { theme: string; size: string; width: string },
      ) => void
    }
  }
}

/** Returns the asynchronously loaded Google Identity browser API, when ready. */
export const getGoogleIdentityApi = (): GoogleIdentityApi | undefined =>
  (window as Window & { google?: GoogleIdentityApi }).google
