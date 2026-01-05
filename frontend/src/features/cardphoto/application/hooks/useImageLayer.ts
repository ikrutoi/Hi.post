import { useMemo } from 'react'
import { fitImageToCard } from '../utils/imageFit'
import type { ImageMeta, ImageLayer, CardLayer } from '../../domain/types'

export const useImageLayer = (
  imageMeta: ImageMeta | null,
  cardLayer: CardLayer
): ImageLayer | null => {
  return useMemo(() => {
    if (!imageMeta) return null
    return fitImageToCard(imageMeta, cardLayer)
  }, [imageMeta, cardLayer.width, cardLayer.height, cardLayer.orientation])
}
