import { useMemo } from 'react'
import type { ImageMeta, CardphotoState } from '../../domain/types'

export function useCurrentImageMeta(
  state: CardphotoState | null,
): ImageMeta | null {
  return useMemo(() => {
    if (!state) return null

    const userImg = state.base.user.image
    const stockImg = state.base.stock.image
    const configImg = state.currentConfig?.image.meta

    if (configImg?.source === 'user' && userImg) {
      return userImg
    }

    if (configImg?.source === 'stock' && stockImg) {
      return stockImg
    }

    if (userImg) return userImg

    return stockImg || null
  }, [
    state?.currentConfig?.image.meta.id,
    state?.base.user.image?.id,
    state?.base.stock.image?.id,
  ])
}
