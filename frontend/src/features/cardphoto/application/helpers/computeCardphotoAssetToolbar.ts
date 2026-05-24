import type { CardphotoAssetToolbar, CardphotoState } from '../../domain/types'

/**
 * Derives which cardphoto toolbar section matches the active slot + image meta.
 * Uses only `assetData` (+ `appliedData` for apply state). Templates and cropped previews → view; original upload → create.
 */
export function computeCardphotoAssetToolbar(
  s: CardphotoState,
): CardphotoAssetToolbar {
  const img = s.assetData
  const applied = s.appliedData
  if (!img) return null
  const isApply = !!(img.id && applied?.id && img.id === applied.id)
  if (img.status === 'inLine' || img.status === 'outLine' || isApply) {
    return 'cardphotoView'
  }
  // Fresh upload: `processed` on meta is technical; create UI follows `source: original`.
  if (img.source === 'original') return 'cardphotoCreate'
  if (img.status === 'processed') return 'cardphotoView'
  return 'cardphotoCreate'
}
