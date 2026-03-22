import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { roundTo } from '@shared/utils/layout'
import type { ImageMeta } from '../../domain/types'

export const useImageUpload = (
  onUpload: (meta: ImageMeta) => void,
  onLoading: () => void,
) => {
  // console.log('USE_IMAGE_UPLOAD')

  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      onLoading()
      const objectUrl = URL.createObjectURL(file)
      const img = new Image()

      img.onload = () => {
        const width = img.naturalWidth
        const height = img.naturalHeight
        const imageAspectRatio = roundTo(width / height, 3)

        const imageMeta: ImageMeta = {
          id: nanoid(),
          source: 'user',
          status: 'processed',
          url: objectUrl,
          width,
          height,
          imageAspectRatio,
          rotation: 0,
          isCropped: false,
          timestamp: Date.now(),
          full: {
            blob: file,
            url: objectUrl,
            width: width,
            height: height,
          },
        }
        onUpload(imageMeta)
      }
      img.src = objectUrl
    },
    [onUpload, onLoading],
  )
}
