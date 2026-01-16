import { useMemo } from 'react'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import type { CardphotoState, ImageMeta } from '../../domain/types'
import { STOCK_IMAGES } from '@shared/assets/stock'

export function useCardphotoSrc(state: CardphotoState | null) {
  return useMemo(() => {
    if (!state) return { src: placeholderImage, alt: 'Placeholder' }

    const userImg = state.base.user.image
    const stockImg = state.base.stock.image
    const configImg = state.currentConfig?.image.meta

    if (userImg && (!configImg || configImg.source !== 'user')) {
      return { src: userImg.url, alt: userImg.id }
    }

    if (configImg?.url) {
      return { src: configImg.url, alt: configImg.id }
    }

    if (userImg) {
      return { src: userImg.url, alt: userImg.id }
    }
    if (stockImg) {
      return { src: stockImg.url, alt: stockImg.id }
    }

    return { src: placeholderImage, alt: 'Placeholder' }
  }, [
    state?.currentConfig?.image.meta.url,
    state?.currentConfig?.image.meta.source,
    state?.base.user.image?.url,
    state?.base.stock.image?.url,
  ])
}
