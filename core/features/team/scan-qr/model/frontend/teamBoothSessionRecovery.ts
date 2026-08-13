type TeamBoothSessionRecoveryState = {
  hadActiveSession: boolean
  hasSession: boolean
  isFetched: boolean
  isFetching: boolean
}

/** Detects a session that ended in DB even when its realtime release event was missed. */
export const shouldResetBoothRequest = ({
  hadActiveSession,
  hasSession,
  isFetched,
  isFetching,
}: TeamBoothSessionRecoveryState) => (
  hadActiveSession && !hasSession && isFetched && !isFetching
)
