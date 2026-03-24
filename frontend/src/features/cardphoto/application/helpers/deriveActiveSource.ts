import type { ActiveImageSource, CardphotoState } from '../../domain/types'

/** Derive current source from the active editor image data. */
export function deriveActiveSource(
  state: CardphotoState | null,
): ActiveImageSource | null {
  if (!state) return null

  const asset = state.assetData
  const applied = state.appliedData ?? state.base.apply.image
  if (asset?.id && applied?.id && asset.id === applied.id) return 'apply'

  if (asset?.status === 'processed') return 'processed'
  if (asset?.source === 'user') return 'user'
  if (asset?.source === 'stock') return 'stock'

  return null
}
