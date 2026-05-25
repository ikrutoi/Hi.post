import type { ImageMeta } from '@cardphoto/domain/types'
import { storeAdapters } from '@db/adapters/storeAdapters'

/** Бинарники кропа/apply: `cardphotoImages`, fallback — `applyImage`. */
export async function loadCardphotoImageMetaFromIdb(
  id: string,
): Promise<ImageMeta | null> {
  const row = await storeAdapters.cardphotoImages.getById(id)
  if (row) return row as ImageMeta

  const applyRec = await storeAdapters.applyImage.getById('current_apply_image')
  if (applyRec?.image?.id === id) return applyRec.image as ImageMeta

  return null
}
