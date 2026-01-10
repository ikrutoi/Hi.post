import { useEffect, useState } from 'react'
import { roundTo } from '@/shared/utils/layout'
import type { ImageMeta } from '../../domain/types'

export const useImageMetaLoader = (src: string, imageId: string = 'loaded') => {
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setIsReady(false)
    setHasError(false)
    setImageMeta(null)

    if (!src) return

    const img = new Image()
    img.src = src

    img.onload = () => {
      setImageMeta({
        id: imageId,
        source: 'user',
        url: src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        imageAspectRatio: roundTo(img.naturalWidth / img.naturalHeight, 3),
        timestamp: Date.now(),
      })
      setIsReady(true)
    }

    img.onerror = () => {
      setHasError(true)
      setIsReady(false)
      setImageMeta(null)
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src, imageId])

  return { imageMeta, isReady, hasError }
}
