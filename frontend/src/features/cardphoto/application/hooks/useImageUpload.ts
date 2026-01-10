import { useCallback } from 'react'
import { roundTo } from '@shared/utils/layout'
import type { ImageMeta } from '../../domain/types'

export const useImageUpload = (
  onUpload: (meta: ImageMeta) => void,
  onLoading: () => void
) => {
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      onLoading()

      const objectUrl = URL.createObjectURL(file)
      const img = new Image()

      img.onload = () => {
        const imageMeta: ImageMeta = {
          id: `${file.name}-${file.lastModified}`,
          source: 'user',
          url: objectUrl,
          timestamp: file.lastModified ?? Date.now(),
          width: img.width,
          height: img.height,
          imageAspectRatio: roundTo(img.width / img.height, 3),
        }

        onUpload(imageMeta)

        URL.revokeObjectURL(objectUrl)
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
      }

      img.src = objectUrl
    },
    [onUpload, onLoading]
  )
}
