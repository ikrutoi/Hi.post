import type { CardphotoAssetToolbar, CardphotoState } from '../../domain/types'
import { deriveActiveSource } from './deriveActiveSource'

/**
 * Derives which cardphoto toolbar section matches the active slot + image meta.
 * Keep in sync with UI: `inLine` or `apply` → view; `processed` slot → processed; else create.
 */
export function computeCardphotoAssetToolbar(
  s: CardphotoState,
): CardphotoAssetToolbar {
  const src = deriveActiveSource(s)
  if (src == null) return null
  const img = s.assetData ?? s.base[src]?.image ?? null
  if (!img) return null
  if (img.status === 'inLine' || src === 'apply') return 'cardphotoView'
  if (src === 'processed') return 'cardphotoProcessed'
  return 'cardphotoCreate'
}
