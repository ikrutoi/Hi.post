import { nanoid } from 'nanoid'
import { useCallback } from 'react'
import { roundTo } from '@shared/utils/layout'
import type { ImageMeta } from '../../domain/types'

export const useImageUpload = (
  onUpload: (meta: ImageMeta) => void,
  onLoading: () => void,
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
          id: nanoid(),
          source: 'user',
          url: objectUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
          imageAspectRatio: roundTo(img.naturalWidth / img.naturalHeight, 3),
          timestamp: Date.now(),
        }
        onUpload(imageMeta)
      }
      img.src = objectUrl
    },
    [onUpload, onLoading],
  )
}

export const useImageUpload1 = (
  onUpload: (meta: ImageMeta) => void,
  onLoading: () => void,
) => {
  return useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      e.target.value = ''

      onLoading()

      const objectUrl = URL.createObjectURL(file)
      const img = new Image()

      img.onload = () => {
        const imageMeta: ImageMeta = {
          id: `${file.name}-${file.lastModified}-${Date.now()}`,
          source: 'user',
          url: objectUrl,
          timestamp: Date.now(),
          width: img.naturalWidth,
          height: img.naturalHeight,
          imageAspectRatio: roundTo(img.naturalWidth / img.naturalHeight, 3),
        }

        onUpload(imageMeta)
      }

      img.onerror = () => {
        console.error('Failed to load image for metadata')
        URL.revokeObjectURL(objectUrl)
      }

      img.src = objectUrl
    },
    [onUpload, onLoading],
  )
}
