import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

/**
 * Owns the selected cover file and its temporary browser preview URL.
 *
 * Object URLs are revoked when replaced, cleared, or unmounted so the form
 * state hook does not need to manage browser resources.
 */
export const useCoverImage = () => {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const previewUrlRef = useRef('')

  const clear = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = ''
    }
    setFile(null)
    setPreviewUrl('')
  }, [])

  const select = useCallback((nextFile: File) => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
    }
    const nextPreviewUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = nextPreviewUrl
    setFile(nextFile)
    setPreviewUrl(nextPreviewUrl)
  }, [])

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
      }
    },
    [],
  )

  return { clear, file, previewUrl, select }
}
