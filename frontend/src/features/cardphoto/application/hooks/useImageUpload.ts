import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { roundTo } from '@shared/utils/layout'
import type { ImageMeta } from '../../domain/types'

export const useImageUpload = (
  onUpload: (meta: ImageMeta) => void,
  onLoading: () => void,
) => {
  console.log('useImageUpload imageMeta')
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      onLoading()
      const objectUrl = URL.createObjectURL(file)
      const img = new Image()

      img.onload = () => {
        const imageMeta: ImageMeta = {
          id: nanoid(),
          source: 'user',
          url: objectUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          imageAspectRatio: roundTo(img.naturalWidth / img.naturalHeight, 3),
          isCropped: false,
          timestamp: Date.now(),
        }
        onUpload(imageMeta)
      }
      img.src = objectUrl
    },
    [onUpload, onLoading],
  )
}
