import { useEffect, useState } from 'react'
import { CARD_SCALE_CONFIG } from '@shared/config/constants'
import { roundTo } from '@shared/utils/layout'
import type { CropState, ImageData } from '../../domain/types'

export const useImageLoader = (
  src: string,
  cardWidth: number,
  cardHeight: number,
  imageId?: string
) => {
  const [imageData, setImageData] = useState<CropState | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsReady(false)
    setHasError(false)
    setImageData(null)

    if (!src) return

    const img = new Image()
    img.src = src

    img.onload = () => {
      const scaleX = cardWidth / img.naturalWidth
      const scaleY = cardHeight / img.naturalHeight
      const scale = Math.min(scaleX, scaleY)
      const imageAspectRatio = img.naturalWidth / img.naturalHeight

      const finalWidth = img.naturalWidth * scale - 1
      const finalHeight = img.naturalHeight * scale - 1
      const offsetX = (cardWidth - finalWidth) / 2 - 1
      const offsetY = (cardHeight - finalHeight) / 2 - 1

      if (!imageId) return

      setImageData({
        width: roundTo(finalWidth, 2),
        height: roundTo(finalHeight, 2),
        left: roundTo(offsetX, 2),
        top: roundTo(offsetY, 2),
        aspectRatio: CARD_SCALE_CONFIG.aspectRatio,
        imageAspectRatio: roundTo(imageAspectRatio, 3),
        ownerImageId: imageId,
      })

      setIsReady(true)
    }

    img.onerror = () => {
      setHasError(true)
      setIsReady(false)
      setImageData(null)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, cardWidth, cardHeight])

  return { imageData, isReady, hasError }
}
