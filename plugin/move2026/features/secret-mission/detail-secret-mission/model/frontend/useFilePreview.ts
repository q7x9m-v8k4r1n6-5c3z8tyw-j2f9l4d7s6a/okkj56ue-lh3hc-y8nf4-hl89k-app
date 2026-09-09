import { useState, useEffect } from 'react'

/**
 * Owns a selected file and revokes its object URL when no longer needed.
 */
export const useFilePreview = (file: File | null) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => (file ? URL.createObjectURL(file) : null))
  const [prevFile, setPrevFile] = useState<File | null>(file)

  if (file !== prevFile) {
    setPrevFile(file)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return previewUrl
}