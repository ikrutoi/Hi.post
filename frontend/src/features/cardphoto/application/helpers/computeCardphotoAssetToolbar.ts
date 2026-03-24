import type { CardphotoAssetToolbar, CardphotoState } from '../../domain/types'

/**
 * Derives which cardphoto toolbar section matches the active slot + image meta.
 * Uses only `assetData` (+ `appliedData` for apply state). `inLine` or applied preview → view; processed → processed; else create.
 */
export function computeCardphotoAssetToolbar(
  s: CardphotoState,
): CardphotoAssetToolbar {
  const img = s.assetData
  const applied = s.appliedData
  if (!img) return null
  const isApply = !!(img.id && applied?.id && img.id === applied.id)
  if (img.status === 'inLine' || isApply) return 'cardphotoView'
  if (img.status === 'processed') return 'cardphotoProcessed'
  return 'cardphotoCreate'
}
