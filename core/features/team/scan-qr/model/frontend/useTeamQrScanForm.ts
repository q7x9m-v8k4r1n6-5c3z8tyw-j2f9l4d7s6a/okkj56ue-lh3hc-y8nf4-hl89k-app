import { useState } from 'react'

export const useTeamQrScanForm = () => {
  const [rawQrCode, setRawQrCode] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  return {
    rawQrCode,
    setRawQrCode,
    errorMessage,
    setErrorMessage,
  }
}