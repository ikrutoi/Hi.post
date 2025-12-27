import { useEffect, useState } from 'react'
import type { ImageData } from '../../domain/types'

export const useImageLoader = (
  src: string,
  cardWidth: number,
  cardHeight: number
  // aspectRatio: number
) => {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  const round2 = (value: number) => Number(value.toFixed(2))

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
      const aspectRatio = img.naturalWidth / img.naturalHeight

      const finalWidth = img.naturalWidth * scale - 1
      const finalHeight = img.naturalHeight * scale - 1
      const offsetX = (cardWidth - finalWidth) / 2 - 1
      const offsetY = (cardHeight - finalHeight) / 2 - 1

      setImageData({
        width: round2(finalWidth),
        height: round2(finalHeight),
        left: round2(offsetX),
        top: round2(offsetY),
        aspectRatio: round2(aspectRatio),
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
