import type { ImageMeta } from '@cardphoto/domain/types'
import { collectReferencedBlobUrls } from '@app/middleware/blobUrlRevokeGuards'
import { store } from '@app/state/store'
import type { RootState } from '@app/state'
import { fillImageMetaThumbFromRemote } from '@features/files/application/pushImageMetaToRemoteFiles'

const LIST_THUMB_PX = 360
/** Larger than a 360px JPEG; treat as the full frame and shrink before caching. */
const FULL_FRAME_BYTES = 400 * 1024

type CacheEntry = {
  src: string
  owned: boolean
}

const cache = new Map<string, CacheEntry>()

function isHttpUrl(url: string | null | undefined): boolean {
  return typeof url === 'string' && /^https?:\/\//i.test(url.trim())
}

export function peekCardphotoListThumbSrc(id: string): string | null {
  return cache.get(id)?.src ?? null
}

function remember(id: string, src: string, owned: boolean): string {
  const prev = cache.get(id)
  if (prev && prev.src !== src && prev.owned) {
    revokeOwned(prev.src)
  }
  cache.set(id, { src, owned })
  return src
}

function revokeOwned(src: string) {
  if (!src.startsWith('blob:')) return
  const state = store.getState() as RootState
  const referenced = collectReferencedBlobUrls({
    cardphoto: state.cardphoto.state,
    cards: state.card.cards,
    cartItems: state.cart.items,
    assetRegistryImages: state.assetRegistry.images,
    calendarPreviewCache: state.card.calendarPreviewCache,
    assemblyFreeze: state.assemblyBranchFreeze.freeze,
  })
  if (!referenced.has(src)) {
    URL.revokeObjectURL(src)
  }
}

/** Drop thumbs whose templates left the inline list. */
export function retainCardphotoListThumbCache(keepIds: ReadonlySet<string>) {
  for (const [id, entry] of cache) {
    if (keepIds.has(id)) continue
    cache.delete(id)
    if (entry.owned) revokeOwned(entry.src)
  }
}

async function squareThumbBlob(source: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(source)
  try {
    const canvas = document.createElement('canvas')
    canvas.width = LIST_THUMB_PX
    canvas.height = LIST_THUMB_PX
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('No 2d context')
    const side = Math.min(bitmap.width, bitmap.height)
    const sx = (bitmap.width - side) / 2
    const sy = (bitmap.height - side) / 2
    ctx.drawImage(
      bitmap,
      sx,
      sy,
      side,
      side,
      0,
      0,
      LIST_THUMB_PX,
      LIST_THUMB_PX,
    )
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('thumb blob'))),
        'image/jpeg',
        0.85,
      )
    })
  } finally {
    bitmap.close()
  }
}

async function rememberBlob(id: string, blob: Blob): Promise<string> {
  const thumb =
    blob.size > FULL_FRAME_BYTES ? await squareThumbBlob(blob) : blob
  return remember(id, URL.createObjectURL(thumb), true)
}

/** Session cache of list thumbs. Full frames are shrunk once, then reused by id. */
export async function resolveCardphotoListThumbSrc(
  meta: ImageMeta,
): Promise<string> {
  const cached = peekCardphotoListThumbSrc(meta.id)
  if (cached) return cached

  if (meta.thumbnail?.blob instanceof Blob) {
    return rememberBlob(meta.id, meta.thumbnail.blob)
  }

  const httpThumb = meta.thumbnail?.url?.trim()
  if (isHttpUrl(httpThumb)) {
    return remember(meta.id, httpThumb, false)
  }

  if (meta.remoteFileId) {
    const filled = await fillImageMetaThumbFromRemote(meta)
    const blob = filled?.thumbnail?.blob
    const remoteUrl = filled?.thumbnail?.url
    if (blob instanceof Blob) {
      if (remoteUrl?.startsWith('blob:')) URL.revokeObjectURL(remoteUrl)
      return rememberBlob(meta.id, blob)
    }
    if (isHttpUrl(remoteUrl)) {
      return remember(meta.id, remoteUrl.trim(), false)
    }
  }

  if (meta.full?.blob instanceof Blob) {
    return rememberBlob(meta.id, meta.full.blob)
  }

  return ''
}
