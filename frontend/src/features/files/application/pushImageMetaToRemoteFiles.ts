import type { ImageMeta } from '@cardphoto/domain/types'
import { storeAdapters } from '@db/adapters/storeAdapters'
import {
  getFileRepository,
  imageMetaToUploadInput,
} from '../infrastructure/fileRepository'

/** Persist factory crop blobs to Laravel; postcard keeps `remoteFileId`. */
export async function pushImageMetaToRemoteFiles(
  imageId: string,
): Promise<string | null> {
  const repo = getFileRepository()
  if (!repo) return null

  const row = await storeAdapters.cardphotoImages.getById(imageId)
  if (!row) return null
  if (row.remoteFileId) return row.remoteFileId

  const input = imageMetaToUploadInput(row)
  if (!input) return null

  const uploaded = await repo.upload(input)
  const next: ImageMeta & { id: string } = {
    ...row,
    remoteFileId: uploaded.id,
    timestamp: Date.now(),
  }
  await storeAdapters.cardphotoImages.put(next)
  return uploaded.id
}

export async function fillImageMetaBlobsFromRemote(
  meta: ImageMeta,
): Promise<ImageMeta | null> {
  const repo = getFileRepository()
  if (!repo || !meta.remoteFileId) return null
  if (meta.full?.blob && meta.thumbnail?.blob) return meta

  const original = await repo.downloadVariant(meta.remoteFileId, 'original')
  let thumb = meta.thumbnail?.blob ?? null
  try {
    thumb = await repo.downloadVariant(meta.remoteFileId, 'thumb')
  } catch {
    thumb = thumb ?? original
  }

  const originalUrl = URL.createObjectURL(original)
  const thumbUrl = thumb ? URL.createObjectURL(thumb) : originalUrl

  return {
    ...meta,
    url: originalUrl,
    full: {
      blob: original,
      url: originalUrl,
      width: meta.full?.width || meta.width,
      height: meta.full?.height || meta.height,
    },
    thumbnail: {
      blob: thumb ?? original,
      url: thumbUrl,
      width: meta.thumbnail?.width || meta.width,
      height: meta.thumbnail?.height || meta.height,
    },
  }
}
