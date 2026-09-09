import { useState, type FormEvent } from 'react'
import { MobileScreenLayout } from '@/core/shared/ui/MobileScreenLayout'

type TechCacheCodeEntryViewProps = {
  missionName: string
  onBack: () => void
  onVerify: (code: string) => void
  isVerifying: boolean
  errorMessage?: string
}

export const TechCacheCodeEntryView = ({
  onBack,
  onVerify,
  isVerifying,
  errorMessage,
}: TechCacheCodeEntryViewProps) => {
  const [code, setCode] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (code.trim()) onVerify(code.trim())
  }

  return (
    <MobileScreenLayout
      title="Xác nhận Tech Cache"
      onBack={onBack}
      contentClassName="flex flex-col items-center px-5 pt-10"
    >
      <p className="mb-6 text-center text-sm font-medium text-gray-600">
        Quản đội nhập mã để mở khóa 
      </p>

      <form onSubmit={handleSubmit} className="flex w-full max-w-xs flex-col items-center gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="XXXX"
          className="w-full rounded-full border border-gray-300 py-3 text-center text-lg font-bold tracking-widest outline-none focus:border-[#de3336]"
          maxLength={10}
        />

        {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isVerifying || !code.trim()}
          className="w-full rounded-full bg-[#de3336] py-3 text-center font-semibold text-white shadow transition-opacity disabled:opacity-50"
        >
          {isVerifying ? 'Đang xác nhận...' : 'Xác nhận'}
        </button>
      </form>
    </MobileScreenLayout>
  )
}