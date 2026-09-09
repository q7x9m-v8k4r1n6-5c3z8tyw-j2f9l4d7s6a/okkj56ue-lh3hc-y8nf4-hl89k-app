import type { HubConnection } from '@microsoft/signalr'

export type TeamMapConnection = Pick<
  HubConnection,
  'invoke' | 'off' | 'on' | 'onreconnected' | 'start' | 'stop'
>

export type TeamMapSignalRSessionOptions = {
  connection: TeamMapConnection
  onBoothStatusChanged: (boothId: string, status: string) => void
  onReconnected: () => void
  raceId: string
}

/** Keeps booth status fresh in realtime while the database remains the source of truth. */
export const startTeamMapSignalRSession = ({
  connection,
  onBoothStatusChanged,
  onReconnected,
  raceId,
}: TeamMapSignalRSessionOptions) => {
  const joinRaceGroup = () => connection.invoke('JoinRaceGroup', raceId)
  const handleBoothStatusChanged = (
    boothId: string,
    status: string,
  ) => {
    onBoothStatusChanged(boothId, status)
  }

  connection.on('ReceiveBoothStatusChanged', handleBoothStatusChanged)
  connection.onreconnected(() => {
    void joinRaceGroup().then(onReconnected)
  })
  void connection
    .start()
    .then(joinRaceGroup)
    .catch((error: unknown) => {
      console.error('Không thể kết nối cập nhật trạm realtime:', error)
    })

  return () => {
    connection.off('ReceiveBoothStatusChanged', handleBoothStatusChanged)
    void connection.invoke('LeaveRaceGroup', raceId).catch(() => undefined)
    void connection.stop()
  }
}
