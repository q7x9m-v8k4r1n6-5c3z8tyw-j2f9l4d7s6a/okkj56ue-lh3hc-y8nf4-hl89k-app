import type { OrganizerJoinRequest } from './organizerJoinRequest'

export type BoothStatusChangedEvent = {
  boothId: string
  status: string
  teamId: string | null
  teamName: string | null
}

/** Maps a pending SignalR event for any assigned booth into frontend request state. */
export const mapBoothStatusToJoinRequest = (
  assignedBoothIds: readonly string[],
  event: BoothStatusChangedEvent,
): OrganizerJoinRequest | null => {
  const isAssigned = assignedBoothIds.some(
    (boothId) => boothId.toLowerCase() === event.boothId.toLowerCase(),
  )

  if (
    !isAssigned ||
    event.status.toLowerCase() !== 'pending' ||
    !event.teamId
  ) {
    return null
  }

  return {
    boothId: event.boothId,
    id: event.teamId,
    teamName: event.teamName ?? 'Đội chưa xác định',
  }
}
