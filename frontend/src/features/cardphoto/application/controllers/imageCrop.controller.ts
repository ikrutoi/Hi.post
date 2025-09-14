import { useCallback, useState } from 'react'
import { saveCroppedImage } from '../imageCropService'
import type { ImageBase } from '../../domain/types'

export const useImageCropController = () => {
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveImage = useCallback(
    async (base: ImageBase, croppedBase64: string) => {
      setIsSaving(true)
      setError(null)
      try {
        await saveCroppedImage(base, croppedBase64)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsSaving(false)
      }
    },
    []
  )

  return {
    saveImage,
    isSaving,
    error,
  }
}
