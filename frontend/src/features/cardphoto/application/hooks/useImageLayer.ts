import { useMemo } from 'react'
import { fitImageToCard } from '../utils/imageFit'
import type {
  ImageMeta,
  ImageLayer,
  CardLayer,
  ImageOrientation,
} from '../../domain/types'

export const useImageLayer = (
  imageMeta: ImageMeta | null,
  cardLayer: CardLayer,
  orientation: ImageOrientation,
): ImageLayer | null => {
  return useMemo(() => {
    if (!imageMeta) return null
    return fitImageToCard(
      imageMeta,
      cardLayer,
      orientation,
      imageMeta.isCropped,
    )
  }, [
    imageMeta,
    cardLayer.width,
    cardLayer.height,
    cardLayer.orientation,
    orientation,
  ])
}
