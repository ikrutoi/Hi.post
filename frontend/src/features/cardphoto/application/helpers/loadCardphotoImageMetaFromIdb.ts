import type { ImageMeta } from '@cardphoto/domain/types'
import { hydrateMeta } from '@app/middleware/cardphotoHelpers'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { fillImageMetaBlobsFromRemote } from '@features/files/application/pushImageMetaToRemoteFiles'

/**
 * Restore object URLs after reload: IndexedDB blobs, or download `remoteFileId`.
 */
export async function reviveImageMeta(
  meta: ImageMeta | null | undefined,
): Promise<ImageMeta | null> {
  if (!meta) return null
  let withBytes = meta
  try {
    const filled = await fillImageMetaBlobsFromRemote(meta)
    if (filled) {
      withBytes = filled
      if (filled !== meta && filled.id) {
        try {
          await storeAdapters.cardphotoImages.putLocal({
            ...filled,
            id: filled.id,
          })
        } catch {
          // In-memory URLs still work if IDB write fails.
        }
      }
    }
  } catch {
    withBytes = meta
  }
  return hydrateMeta(withBytes)
}

/** Бинарники кропа/apply: `cardphotoImages`, fallback — `applyImage`. */
export async function loadCardphotoImageMetaFromIdb(
  id: string,
): Promise<ImageMeta | null> {
  const row = await storeAdapters.cardphotoImages.getById(id)
  if (row) {
    return reviveImageMeta(row as ImageMeta)
  }

  const applyRec = await storeAdapters.applyImage.getById('current_apply_image')
  if (applyRec?.image?.id === id) {
    return reviveImageMeta(applyRec.image as ImageMeta)
  }

  return null
}
