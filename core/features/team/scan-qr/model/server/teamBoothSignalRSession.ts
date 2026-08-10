import type { HubConnection } from '@microsoft/signalr'

type TeamBoothConnection = Pick<
  HubConnection,
  'invoke' | 'off' | 'on' | 'onreconnected' | 'start' | 'stop'
>

type TeamBoothSignalRSessionOptions = {
  connection: TeamBoothConnection
  onEntryRejected: (boothId: string) => void
  onSessionCancelled: (boothId: string) => void
  raceId: string
  teamId: string
}

const isSameId = (left: string, right: string) =>
  left.toLowerCase() === right.toLowerCase()

/** Registers one team-scoped realtime session and returns its cleanup function. */
export const startTeamBoothSignalRSession = ({
  connection,
  onEntryRejected,
  onSessionCancelled,
  raceId,
  teamId,
}: TeamBoothSignalRSessionOptions) => {
  const joinRaceGroup = () => connection.invoke('JoinRaceGroup', raceId)
  const handleCancelled = (boothId: string, cancelledTeamId: string) => {
    if (isSameId(cancelledTeamId, teamId)) onSessionCancelled(boothId)
  }
  const handleRejected = (boothId: string, rejectedTeamId: string) => {
    if (isSameId(rejectedTeamId, teamId)) onEntryRejected(boothId)
  }

  connection.on('ReceiveBoothEntryCancelled', handleCancelled)
  connection.on('ReceiveBoothEntryRejected', handleRejected)
  connection.onreconnected(() => {
    void joinRaceGroup()
  })
  void connection
    .start()
    .then(joinRaceGroup)
    .catch((error: unknown) => {
      console.error('Không thể kết nối Booth Hub:', error)
    })

  return () => {
    connection.off('ReceiveBoothEntryCancelled', handleCancelled)
    connection.off('ReceiveBoothEntryRejected', handleRejected)
    void connection.invoke('LeaveRaceGroup', raceId).catch(() => undefined)
    void connection.stop()
  }
}
