import { useState, useEffect } from 'react'

/**
 * Owns a selected file and revokes its object URL when no longer needed.
 */
export const useFilePreview = (file: File | null) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Cleanup: Chống memory leak khi đổi file hoặc tắt màn hình
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return previewUrl
}