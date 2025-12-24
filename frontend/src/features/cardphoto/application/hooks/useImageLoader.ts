import { useEffect, useState } from 'react'

export const useImageLoader = (
  src: string,
  cardWidth: number,
  cardHeight: number
) => {
  const [imageData, setImageData] = useState<{
    width: number
    height: number
    left: number
    top: number
  } | null>(null)
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

      const finalWidth = img.naturalWidth * scale
      const finalHeight = img.naturalHeight * scale
      const offsetX = (cardWidth - finalWidth) / 2
      const offsetY = (cardHeight - finalHeight) / 2

      setImageData({
        width: finalWidth,
        height: finalHeight,
        left: offsetX,
        top: offsetY,
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
