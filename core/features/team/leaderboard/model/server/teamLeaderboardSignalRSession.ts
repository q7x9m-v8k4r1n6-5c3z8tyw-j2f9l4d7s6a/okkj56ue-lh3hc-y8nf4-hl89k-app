import type { HubConnection } from '@microsoft/signalr'

type TeamLeaderboardConnection = Pick<
  HubConnection,
  'invoke' | 'off' | 'on' | 'onreconnected' | 'start' | 'stop'
>

type TeamLeaderboardSignalRSessionOptions = {
  connection: TeamLeaderboardConnection
  onRaceScoreChanged: () => void
  onReconnected: () => void
  raceId: string
}

const isSameId = (left: string, right: string) =>
  left.toLowerCase() === right.toLowerCase()

/** Keeps score queries fresh while the database remains the source of truth. */
export const startTeamLeaderboardSignalRSession = ({
  connection,
  onRaceScoreChanged,
  onReconnected,
  raceId,
}: TeamLeaderboardSignalRSessionOptions) => {
  const joinRaceGroup = () => connection.invoke('JoinRaceGroup', raceId)
  const handleRaceScoreChanged = (changedRaceId: string) => {
    if (isSameId(changedRaceId, raceId)) onRaceScoreChanged()
  }

  connection.on('ReceiveRaceScoreChanged', handleRaceScoreChanged)
  connection.onreconnected(() => {
    void joinRaceGroup().then(onReconnected)
  })
  void connection
    .start()
    .then(joinRaceGroup)
    .catch((error: unknown) => {
      console.error('Không thể kết nối cập nhật điểm realtime:', error)
    })

  return () => {
    connection.off('ReceiveRaceScoreChanged', handleRaceScoreChanged)
    void connection.invoke('LeaveRaceGroup', raceId).catch(() => undefined)
    void connection.stop()
  }
}
