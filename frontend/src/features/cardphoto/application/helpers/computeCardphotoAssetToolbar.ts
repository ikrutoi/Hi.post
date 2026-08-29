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
  // Fresh upload: `processed` on meta is technical; create UI follows `source: original`.
  // Must win over `isApply` so Add can reopen the original after it was applied.
  if (img.source === 'original') return 'cardphotoCreate'
  const isApply = !!(img.id && applied?.id && img.id === applied.id)
  if (img.status === 'inLine' || img.status === 'outLine' || isApply) {
    return 'cardphotoView'
  }
  if (img.status === 'processed') return 'cardphotoView'
  return 'cardphotoCreate'
}
