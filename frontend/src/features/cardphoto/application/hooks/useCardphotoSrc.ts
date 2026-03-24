import { useMemo } from 'react'
import placeholderImage from '@shared/assets/images/card-photo-bw.jpg'
import type { CardphotoState, ImageMeta } from '../../domain/types'
import { STOCK_IMAGES } from '@shared/assets/stock'

export function useCardphotoSrc(state: CardphotoState | null) {
  return useMemo(() => {
    if (!state) return { src: placeholderImage, alt: 'Placeholder' }

    const activeImg = state.assetData
    const appliedImg = state.appliedData
    const userImg = state.userOriginalData
    const configImg = state.assetConfig?.image.meta

    if (activeImg?.url) {
      return { src: activeImg.url, alt: activeImg.id }
    }

    if (configImg?.url) {
      return { src: configImg.url, alt: configImg.id }
    }

    if (appliedImg?.url) {
      return { src: appliedImg.url, alt: appliedImg.id }
    }

    if (userImg) {
      return { src: userImg.url, alt: userImg.id }
    }

    return { src: placeholderImage, alt: 'Placeholder' }
  }, [
    state?.assetData?.url,
    state?.assetConfig?.image.meta.url,
    state?.appliedData?.url,
    state?.userOriginalData?.url,
  ])
}
