import { useCallback } from 'react'
import type { ImageMeta } from '../../domain/types'

export const useImageUpload = (
  onUpload: (meta: ImageMeta) => void,
  onCancel: () => void,
  onLoading: () => void
) => {
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      onLoading()
      const imageMeta: ImageMeta = {
        id: `${file.name}-${file.lastModified}`,
        source: 'user',
        // role: 'original',
        url: URL.createObjectURL(file),
        timestamp: file.lastModified ?? Date.now(),
        width: 0,
        height: 0,
      }
      onUpload(imageMeta)
    },
    [onUpload, onCancel, onLoading]
  )
}
