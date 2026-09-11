import type { CardphotoState, ImageMeta } from '../../domain/types'

/** Refresh `userOriginalData` when rebuilding config for a live user/original (non-processed) slot. */
export function shouldSyncUserOriginalOnRebuild(
  asset: ImageMeta | null,
  applied: ImageMeta | null,
): boolean {
  if (!asset) return false
  const isApply = !!(asset.id && applied?.id && asset.id === applied.id)
  if (isApply) return false
  /** Fresh upload uses status `processed` for pipeline; `source: original` marks live editor slot. */
  if (asset.source === 'original') return true
  if (asset.status === 'processed') return false
  return asset.source === 'user'
}

export function shouldSyncUserOriginalForState(
  state: CardphotoState | null,
): boolean {
  if (!state) return false
  return shouldSyncUserOriginalOnRebuild(state.assetData, state.appliedData)
}
