import type { ActiveImageSource, CardphotoBase, ImageMeta } from '../../domain/types'

const BASE_LOOKUP_ORDER: (keyof CardphotoBase)[] = [
  'apply',
  'processed',
  'user',
  'stock',
]

/**
 * Find `ImageMeta` in `base` whose `id` matches (e.g. same id as `assetImage.id`).
 */
export function findImageMetaByIdInBase(
  base: CardphotoBase,
  id: string | null,
): ImageMeta | null {
  if (!id) return null
  for (const slot of BASE_LOOKUP_ORDER) {
    const img = base[slot]?.image
    if (img?.id === id) return img
  }
  return null
}

/** Which editor slot currently holds this image id, if any. */
export function findBaseSlotForImageId(
  base: CardphotoBase,
  id: string | null,
): ActiveImageSource | null {
  if (!id) return null
  for (const slot of BASE_LOOKUP_ORDER) {
    const img = base[slot]?.image
    if (img?.id === id) return slot
  }
  return null
}
