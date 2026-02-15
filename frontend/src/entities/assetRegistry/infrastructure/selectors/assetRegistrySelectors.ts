import { RootState } from '@app/state'
import { ImageAsset } from '../../domain/types'

export const selectAssetRegistry = (state: RootState) =>
  state.assetRegistry.images

export const selectAssetById = (
  state: RootState,
  id: string | null,
): ImageAsset | null => {
  if (!id) return null
  return state.assetRegistry.images[id] || null
}
