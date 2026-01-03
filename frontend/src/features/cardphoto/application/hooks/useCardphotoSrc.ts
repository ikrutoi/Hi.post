import { useMemo } from 'react'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import type { CardphotoState, ImageMeta } from '../../domain/types'
import { STOCK_IMAGES } from '@shared/assets/stock'

export function useCardphotoSrc(state: CardphotoState | null): {
  src: string
  alt: string
} {
  return useMemo(() => {
    if (!state) {
      return { src: placeholderImage, alt: 'Placeholder' }
    }

    if (state.operations.length === 0) {
      const random =
        STOCK_IMAGES[Math.floor(Math.random() * STOCK_IMAGES.length)]
      return { src: random.url, alt: random.id }
    }

    const finalImage: ImageMeta | null = state.base.apply.image
    if (finalImage) {
      return {
        src: finalImage.url,
        alt: finalImage.id,
      }
    }

    if (state.base.user.image) {
      return {
        src: state.base.user.image.url,
        alt: state.base.user.image.id,
      }
    }

    if (state.base.stock.image) {
      return {
        src: state.base.stock.image.url,
        alt: state.base.stock.image.id,
      }
    }

    return { src: placeholderImage, alt: 'Placeholder' }
  }, [state])
}
