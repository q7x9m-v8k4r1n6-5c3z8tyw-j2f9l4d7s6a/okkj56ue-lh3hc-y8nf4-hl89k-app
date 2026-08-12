import type { MyBooth } from '@/core/entities/booth'
import type { OrganizerJoinRequest } from './organizerJoinRequest'

export const mapMyBoothToOrganizerSession = (booth?: MyBooth) => {
  const activeTeam: OrganizerJoinRequest | null = booth?.teamId
    ? {
        boothId: booth.boothId,
        id: booth.teamId,
        teamName: booth.teamName ?? 'Đội chưa xác định',
      }
    : null

  return {
    request: booth?.status === 'pending' ? activeTeam : null,
    acceptedRequest: booth?.status === 'occupied' ? activeTeam : null,
  }
}
