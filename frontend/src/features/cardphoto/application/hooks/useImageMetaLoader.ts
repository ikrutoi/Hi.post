import { useEffect, useState } from 'react'
import { roundTo } from '@/shared/utils/layout'
import type { ImageMeta } from '../../domain/types'

export const useImageMetaLoader = (src: string) => {
  const [state, setState] = useState<{
    imageMeta: ImageMeta | null
    isReady: boolean
    hasError: boolean
    loadedUrl: string | null
  }>({
    imageMeta: null,
    isReady: false,
    hasError: false,
    loadedUrl: null,
  })

  useEffect(() => {
    if (!src) {
      setState({
        imageMeta: null,
        isReady: false,
        hasError: false,
        loadedUrl: null,
      })
      return
    }

    setState((prev) => ({ ...prev, isReady: false, hasError: false }))

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const meta: ImageMeta = {
        id: `user-img-${Date.now()}`,
        source: 'user',
        url: src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        imageAspectRatio: roundTo(img.naturalWidth / img.naturalHeight, 3),
        timestamp: Date.now(),
      }

      setState({
        imageMeta: meta,
        isReady: true,
        hasError: false,
        loadedUrl: src,
      })
    }

    img.onerror = () => {
      setState((prev) => ({ ...prev, hasError: true, isReady: false }))
    }

    img.src = src

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return state
}
