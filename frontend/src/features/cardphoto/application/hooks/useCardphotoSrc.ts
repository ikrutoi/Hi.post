import { useMemo } from 'react'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import type { ImageMeta, ImageHistory } from '../../domain/types'
import { STOCK_IMAGES } from '@shared/assets/stock'

export function useCardphotoSrc(history: ImageHistory | null): {
  src: string
  alt: string
} {
  return useMemo(() => {
    if (!history) {
      return { src: placeholderImage, alt: 'Placeholder' }
    }

    if (history.operations.length <= 1) {
      const random =
        STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)]
      return { src: random.url, alt: random.id }
    }

    const finalImage: ImageMeta | null = history.finalImage
    return {
      src: finalImage?.url || placeholderImage,
      alt: finalImage?.id || 'Edited',
    }
  }, [history])
}
