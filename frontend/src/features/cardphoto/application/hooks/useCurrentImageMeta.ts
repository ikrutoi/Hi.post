import { useMemo } from 'react'
import type { ImageMeta, CardphotoState } from '../../domain/types'

export function useCurrentImageMeta(
  state: CardphotoState | null,
): ImageMeta | null {
  return useMemo(() => {
    if (!state) return null

    return state.assetData ?? state.appliedData ?? state.userOriginalData ?? null
  }, [
    state?.assetData?.id,
    state?.appliedData?.id,
    state?.userOriginalData?.id,
  ])
}
