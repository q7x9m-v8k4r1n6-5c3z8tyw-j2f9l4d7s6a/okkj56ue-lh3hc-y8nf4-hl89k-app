import type { HubConnection } from '@microsoft/signalr'

type ScoringLogHistoryConnection = Pick<
  HubConnection,
  'invoke' | 'off' | 'on' | 'onreconnected' | 'start' | 'stop'
>

type ScoringLogHistorySignalRSessionOptions = {
  connection: ScoringLogHistoryConnection
  onRaceScoreChanged: () => void
  onReconnected: () => void
  raceId: string
}

const isSameId = (left: string, right: string) =>
  left.toLowerCase() === right.toLowerCase()

export const startScoringLogHistorySignalRSession = ({
  connection,
  onRaceScoreChanged,
  onReconnected,
  raceId,
}: ScoringLogHistorySignalRSessionOptions) => {
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
      console.error('Cannot connect scoring log history realtime:', error)
    })

  return () => {
    connection.off('ReceiveRaceScoreChanged', handleRaceScoreChanged)
    void connection.invoke('LeaveRaceGroup', raceId).catch(() => undefined)
    void connection.stop()
  }
}
