import type { Card } from '@entities/card/domain/types'
import { postcardRefsFromCard, type PostcardHydrated } from '@entities/postcard'
import type { ImageMeta } from '@cardphoto/domain/types'
import { cardImageMetaLookupIdsFromCard } from '@entities/card/domain/helpers'
import { loadCardphotoImageMetaFromIdb } from '@cardphoto/application/helpers/loadCardphotoImageMetaFromIdb'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'
import { separateDuplicatePostcardLocalIds } from '@features/sync/domain/separateDuplicatePostcardLocalIds'
import {
  enqueuePostcardUpsert,
  isPostcardPendingDelete,
} from '@features/sync/infrastructure/postcardV2PendingSync'
import { hydrateSessionImageMeta, prepareForRedux } from './cardphotoHelpers'

const isDeadBlobUrl = (u: string | null | undefined): boolean =>
  typeof u === 'string' && u.startsWith('blob:')

function cardphotoPreviewFingerprint(card: Card): string {
  const a = card.cardphoto?.appliedData
  return [
    a?.id ?? '',
    a?.url ?? '',
    a?.thumbnail?.url ?? '',
    a?.full?.url ?? '',
    card.thumbnailUrl ?? '',
  ].join('\u001f')
}

async function loadCardphotoImageFromIdb(id: string): Promise<ImageMeta | null> {
  return loadCardphotoImageMetaFromIdb(id)
}

/**
 * После перезагрузки в `postcards` часто остаются «мертвые» `blob:` в meta; бинарники лежат в `cardphotoImages`.
 * Подтягиваем актуальные URL из IDB (как при гидрации редактора в sessionSaga).
 */
export async function refreshPostcardsCardphotoUrls(
  postcards: PostcardHydrated[],
): Promise<PostcardHydrated[]> {
  return Promise.all(postcards.map(refreshOnePostcard))
}

async function refreshOnePostcard(p: PostcardHydrated): Promise<PostcardHydrated> {
  const applied = p.card.cardphoto?.appliedData
  if (!applied?.id) return p

  const thumbDead = isDeadBlobUrl(p.card.thumbnailUrl)
  const metaDead =
    isDeadBlobUrl(applied.url) ||
    isDeadBlobUrl(applied.full?.url) ||
    isDeadBlobUrl(applied.thumbnail?.url)
  const metaEmpty =
    !String(applied.url ?? '').trim() && !String(applied.thumbnail?.url ?? '').trim()

  if (!metaDead && !metaEmpty && !thumbDead) return p

  let idbMeta: ImageMeta | null = null
  for (const lookupId of cardImageMetaLookupIdsFromCard(p.card, p.postcard)) {
    idbMeta = await loadCardphotoImageFromIdb(lookupId)
    if (idbMeta) break
  }
  const merged = hydrateSessionImageMeta(applied, idbMeta)

  if (!merged) return p

  const nextThumb =
    merged.thumbnail?.url || merged.url || p.card.thumbnailUrl || ''

  const nextCard = {
    ...p.card,
    thumbnailUrl: nextThumb,
    cardphoto: {
      ...p.card.cardphoto,
      appliedData: prepareForRedux(merged),
    },
  }

  if (cardphotoPreviewFingerprint(nextCard) === cardphotoPreviewFingerprint(p.card)) {
    return p
  }

  return {
    ...p,
    postcard: postcardRefsFromCard(nextCard),
    card: nextCard,
  }
}

export async function readPostcardsForReduxHydrate(): Promise<{
  raw: PostcardHydrated[]
  display: PostcardHydrated[]
}> {
  await postcardsAdapter.purgePendingDeletes()
  const stored = (await postcardsAdapter.getAll()).filter(
    (row) => !isPostcardPendingDelete(row),
  )
  const separated = separateDuplicatePostcardLocalIds(stored)
  for (const row of separated.changed) {
    if (!row.id) continue
    await postcardsAdapter.putLocal(row)
    enqueuePostcardUpsert(row)
  }
  const raw = separated.rows
  const display = await refreshPostcardsCardphotoUrls(raw)
  return { raw, display }
}

/**
 * Persist refreshed blob URLs only when IndexedDB has not already been
 * replaced by a newer v2 pull (otherwise a stale hydrate snapshot overwrites
 * the date that arrived from another device).
 */
export async function persistHydratePhotoRefreshIfIdbUnchanged(
  raw: PostcardHydrated[],
  display: PostcardHydrated[],
  extraChanged?: (prev: PostcardHydrated, next: PostcardHydrated) => boolean,
): Promise<void> {
  for (let i = 0; i < display.length; i++) {
    const next = display[i]
    const prev = raw[i]
    if (!prev || !next || prev.id !== next.id) continue
    const extra = extraChanged?.(prev, next) ?? false
    if (!postcardCardphotoNeedsPersist(prev, next) && !extra) continue
    if (next.id) {
      const current = await postcardsAdapter.getById(next.id)
      // A pull may have replaced this row while photo URLs were refreshing.
      // Writing the snapshot back would restore the previous device's date.
      if (
        current &&
        ((current.updatedAt ?? 0) !== (prev.updatedAt ?? 0) ||
          current.date?.year !== prev.date?.year ||
          current.date?.month !== prev.date?.month ||
          current.date?.day !== prev.date?.day)
      ) {
        continue
      }
    }
    await postcardsAdapter.putLocal(next)
  }
}

export function postcardCardphotoNeedsPersist(
  before: PostcardHydrated,
  after: PostcardHydrated,
): boolean {
  return cardphotoPreviewFingerprint(before.card) !== cardphotoPreviewFingerprint(after.card)
}
