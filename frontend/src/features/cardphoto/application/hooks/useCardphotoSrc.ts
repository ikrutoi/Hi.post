import { useMemo } from 'react'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import type { CardphotoState, ImageMeta } from '../../domain/types'
import { STOCK_IMAGES } from '@shared/assets/stock'

export function useCardphotoSrc(state: CardphotoState | null) {
  console.log('useCardphotoSrc', state)
  return useMemo(() => {
    if (!state) return { src: placeholderImage, alt: 'Placeholder' }

    const userImg = state.base.user.image
    const stockImg = state.base.stock.image
    const configImg = state.currentConfig?.image.meta

    if (userImg && (!configImg || configImg.source !== 'user')) {
      console.log('+', userImg.url)
      return { src: userImg.url, alt: userImg.id }
    }

    if (configImg?.url) {
      console.log('++', configImg.url)
      return { src: configImg.url, alt: configImg.id }
    }

    if (userImg) {
      console.log('+++', userImg.url)
      return { src: userImg.url, alt: userImg.id }
    }
    if (stockImg) {
      console.log('+++', stockImg.url)
      return { src: stockImg.url, alt: stockImg.id }
    }

    console.log('+++++')
    return { src: placeholderImage, alt: 'Placeholder' }
  }, [
    state?.currentConfig?.image.meta.url,
    state?.currentConfig?.image.meta.source,
    state?.base.user.image?.url,
    state?.base.stock.image?.url,
  ])
}
