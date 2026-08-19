import type { HubConnection } from '@microsoft/signalr'

type TeamBoothConnection = Pick<
  HubConnection,
  'invoke' | 'off' | 'on' | 'onreconnected' | 'start' | 'stop'
>

type TeamBoothSignalRSessionOptions = {
  connection: TeamBoothConnection
  getActiveBoothId: () => string | undefined
  onBoothStatusChanged: (
    boothId: string,
    status: string,
    teamId?: string | null,
  ) => void
  onBoothCompleted: (
    boothId: string,
    boothName: string,
    score: number,
  ) => void
  onEntryRejected: (boothId: string) => void
  onReconnected: () => void
  onSessionCancelled: (boothId: string) => void
  raceId: string
  teamId: string
}

const isSameId = (left: string, right: string) =>
  left.toLowerCase() === right.toLowerCase()

/** Registers one team-scoped realtime session and returns its cleanup function. */
export const startTeamBoothSignalRSession = ({
  connection,
  getActiveBoothId,
  onBoothStatusChanged,
  onBoothCompleted,
  onEntryRejected,
  onReconnected,
  onSessionCancelled,
  raceId,
  teamId,
}: TeamBoothSignalRSessionOptions) => {
  const joinRaceGroup = () => connection.invoke('JoinRaceGroup', raceId)
  const handleBoothStatusChanged = (
    boothId: string,
    status: string,
    changedTeamId?: string | null,
  ) => {
    const belongsToCurrentTeam = changedTeamId && isSameId(changedTeamId, teamId)
    const belongsToCurrentSession = isSameId(
      boothId,
      getActiveBoothId() ?? '',
    )
    if (belongsToCurrentTeam || belongsToCurrentSession) {
      onBoothStatusChanged(boothId, status, changedTeamId)
    }
  }
  const handleCancelled = (boothId: string, cancelledTeamId: string) => {
    if (isSameId(cancelledTeamId, teamId)) onSessionCancelled(boothId)
  }
  const handleRejected = (boothId: string, rejectedTeamId: string) => {
    if (isSameId(rejectedTeamId, teamId)) onEntryRejected(boothId)
  }
  const handleCompleted = (
    boothId: string,
    completedTeamId: string,
    boothName: string,
    score: number,
  ) => {
    if (isSameId(completedTeamId, teamId)) {
      onBoothCompleted(boothId, boothName, score)
    }
  }

  connection.on('ReceiveBoothStatusChanged', handleBoothStatusChanged)
  connection.on('ReceiveBoothEntryCancelled', handleCancelled)
  connection.on('ReceiveBoothEntryRejected', handleRejected)
  connection.on('ReceiveBoothCompleted', handleCompleted)
  connection.onreconnected(() => {
    void joinRaceGroup().then(onReconnected)
  })
  void connection
    .start()
    .then(joinRaceGroup)
    .catch((error: unknown) => {
      console.error('Không thể kết nối Booth Hub:', error)
    })

  return () => {
    connection.off('ReceiveBoothStatusChanged', handleBoothStatusChanged)
    connection.off('ReceiveBoothEntryCancelled', handleCancelled)
    connection.off('ReceiveBoothEntryRejected', handleRejected)
    connection.off('ReceiveBoothCompleted', handleCompleted)
    void connection.invoke('LeaveRaceGroup', raceId).catch(() => undefined)
    void connection.stop()
  }
}
