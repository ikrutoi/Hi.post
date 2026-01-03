import { useMemo } from 'react'
import type {
  ImageMeta,
  ImageLayer,
  ImageOrientation,
} from '../../domain/types'

export const useImageLayer = (
  imageMeta: ImageMeta | null,
  cardWidth: number,
  cardHeight: number
): ImageLayer | null => {
  return useMemo(() => {
    if (!imageMeta) return null

    const scaleX = cardWidth / imageMeta.width
    const scaleY = cardHeight / imageMeta.height
    const scale = Math.min(scaleX, scaleY)

    const finalWidth = imageMeta.width * scale
    const finalHeight = imageMeta.height * scale
    const offsetX = (cardWidth - finalWidth) / 2
    const offsetY = (cardHeight - finalHeight) / 2

    return {
      meta: {
        ...imageMeta,
        width: finalWidth,
        height: finalHeight,
      },
      left: offsetX,
      top: offsetY,
      orientation: 0 as ImageOrientation,
    }
  }, [imageMeta, cardWidth, cardHeight])
}
