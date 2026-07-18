import { Spinner } from '../Spinner'

export type LoadingScreenProps = {
  text?: string
}

export const LoadingScreen = ({ text = 'Đang tải...' }: LoadingScreenProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        {text ? <p className="text-sm font-medium text-gray-500">{text}</p> : null}
      </div>
    </div>
  )
}