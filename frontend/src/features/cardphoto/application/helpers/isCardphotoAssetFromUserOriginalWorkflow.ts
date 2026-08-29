import type { ImageMeta } from '../../domain/types'

/** The live user upload itself — not a cropped / listed child of it. */
export function isCardphotoUserOriginalAsset(
  asset: ImageMeta | null | undefined,
  userOriginal: ImageMeta | null | undefined,
): boolean {
  if (!asset) return false
  if (asset.source === 'original') return true
  if (userOriginal?.id && asset.id === userOriginal.id) return true
  return false
}

/** Текущий слот относится к загруженному оригиналу (кроп / inLine / apply), а не к чужому шаблону из списка. */
export function isCardphotoAssetFromUserOriginalWorkflow(
  asset: ImageMeta | null | undefined,
  userOriginal: ImageMeta | null | undefined,
  applied: ImageMeta | null | undefined,
): boolean {
  if (!userOriginal?.id) return false

  const originalId = userOriginal.id

  if (!asset) return true

  if (asset.id === originalId) return true
  if (asset.parentImageId === originalId) return true
  if (asset.source === 'original') return true

  if (
    applied?.id === asset.id &&
    (applied.id === originalId || applied.parentImageId === originalId)
  ) {
    return true
  }

  return false
}
