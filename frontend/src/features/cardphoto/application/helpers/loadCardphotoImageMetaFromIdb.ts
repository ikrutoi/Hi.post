import type { ImageMeta } from '@cardphoto/domain/types'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { fillImageMetaBlobsFromRemote } from '@features/files/application/pushImageMetaToRemoteFiles'

/** Бинарники кропа/apply: `cardphotoImages`, fallback — `applyImage`. */
export async function loadCardphotoImageMetaFromIdb(
  id: string,
): Promise<ImageMeta | null> {
  const row = await storeAdapters.cardphotoImages.getById(id)
  if (row) {
    try {
      const filled = await fillImageMetaBlobsFromRemote(row as ImageMeta)
      if (filled && filled !== row) {
        await storeAdapters.cardphotoImages.put({ ...filled, id: filled.id })
        return filled
      }
    } catch {
      return row as ImageMeta
    }
    return row as ImageMeta
  }

  const applyRec = await storeAdapters.applyImage.getById('current_apply_image')
  if (applyRec?.image?.id === id) return applyRec.image as ImageMeta

  return null
}
