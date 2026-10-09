import type { Card } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { ImageAsset } from '@entities/assetRegistry/domain/types'
import type { CardphotoState, ImageMeta } from '@cardphoto/domain/types'
import type { AssemblyBranchFreeze } from '@cardPanel/domain/types/assemblyBranchFreeze.types'

/**
 * Blob-адреса снимка сборки. Их нельзя отзывать, пока мини-паи
 * показывают фабрику, а общая сессия уже занята корзиной.
 */
const protectedAssemblyBlobUrls = new Set<string>()

export function protectAssemblyBlobUrl(url: string | null | undefined): void {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    protectedAssemblyBlobUrls.add(url)
  }
}

function addImageMetaBlobs(
  meta: ImageMeta | null | undefined,
  sink: Set<string>,
): void {
  if (!meta) return
  const add = (u: string | null | undefined) => {
    if (u && u.startsWith('blob:')) sink.add(u)
  }
  add(meta.url)
  add(meta.thumbnail?.url)
  add(meta.full?.url)
}

function addCardphotoStateBlobs(
  cp: CardphotoState | null | undefined,
  sink: Set<string>,
): void {
  if (!cp) return
  addImageMetaBlobs(cp.appliedData, sink)
  addImageMetaBlobs(cp.assetData, sink)
  addImageMetaBlobs(cp.userOriginalData, sink)
  addImageMetaBlobs(cp.assetConfig?.image?.meta, sink)
}

function addRegistryBlobs(
  images: Record<string, ImageAsset> | undefined,
  sink: Set<string>,
): void {
  if (!images) return
  for (const a of Object.values(images)) {
    if (a.url?.startsWith('blob:')) sink.add(a.url)
    if (a.thumbUrl?.startsWith('blob:')) sink.add(a.thumbUrl)
  }
}

function addCalendarPreviewCacheBlobs(
  cache: Record<string, string> | undefined,
  sink: Set<string>,
): void {
  if (!cache) return
  for (const u of Object.values(cache)) {
    if (u?.startsWith('blob:')) sink.add(u)
  }
}

function addAssemblyFreezeBlobs(
  freeze: AssemblyBranchFreeze | null | undefined,
  sink: Set<string>,
): void {
  if (freeze == null) return
  const add = (u: string | null | undefined) => {
    if (u && u.startsWith('blob:')) sink.add(u)
  }
  const preview = freeze.editorData?.data?.cardphoto
  add(preview?.previewUrl)
  add(preview?.thumbUrl)
  addImageMetaBlobs(freeze.cardphoto?.appliedData, sink)
  addImageMetaBlobs(freeze.cardphoto?.assetData, sink)
}

function addCartPostcardBlobs(
  items: readonly PostcardHydrated[] | undefined,
  sink: Set<string>,
): void {
  if (!items) return
  for (const p of items) {
    if (p.card.thumbnailUrl?.startsWith('blob:')) sink.add(p.card.thumbnailUrl)
    addCardphotoStateBlobs(p.card.cardphoto, sink)
  }
}

export type BlobUrlRevokeGuardSnapshot = {
  cardphoto: CardphotoState | null | undefined
  cards: readonly Card[] | undefined
  cartItems?: readonly PostcardHydrated[]
  assetRegistryImages?: Record<string, ImageAsset>
  calendarPreviewCache?: Record<string, string>
  /** Снимок сборки, пока корзина/история пишет в общую сессию. */
  assemblyFreeze?: AssemblyBranchFreeze | null
}

/**
 * Все blob:-URL, на которые ещё есть ссылки в стейте (редактор, все `Card` в `card.cards`,
 * реестр изображений, кэш превью календаря). Перед revoke URL должен отсутствовать здесь.
 *
 * Реестр важен: при новом кропе `setAsset` кладёт новый id, старые `ImageAsset` с теми же
 * blob остаются в `assetRegistry` — без учёта реестра мы отзывали URL и ломали оставшиеся ссылки.
 */
export function collectReferencedBlobUrls(snap: BlobUrlRevokeGuardSnapshot): Set<string> {
  const s = new Set<string>()
  addCardphotoStateBlobs(snap.cardphoto, s)
  if (snap.cards) {
    for (const c of snap.cards) {
      if (c.thumbnailUrl?.startsWith('blob:')) s.add(c.thumbnailUrl)
      addCardphotoStateBlobs(c.cardphoto, s)
    }
  }
  addCartPostcardBlobs(snap.cartItems, s)
  addRegistryBlobs(snap.assetRegistryImages, s)
  addCalendarPreviewCacheBlobs(snap.calendarPreviewCache, s)
  addAssemblyFreezeBlobs(snap.assemblyFreeze, s)
  for (const url of protectedAssemblyBlobUrls) s.add(url)
  return s
}
