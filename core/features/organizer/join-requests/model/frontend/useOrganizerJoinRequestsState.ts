import { useState } from 'react'

type JoinRequest = {
  id: string
  teamName: string
}

const initialRequest: JoinRequest = {
  id: 'team-a-request',
  teamName: 'Team A',
}

/**
 * Owns organizer request UI state until the station request API is connected.
 */
export const useOrganizerJoinRequestsState = () => {
  const [request, setRequest] = useState<JoinRequest | null>(initialRequest)

  return {
    acceptRequest: () => setRequest(null),
    rejectRequest: () => setRequest(null),
    request,
  }
}
