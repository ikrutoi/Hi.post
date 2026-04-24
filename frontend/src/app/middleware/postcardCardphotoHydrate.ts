import type { Postcard } from '@entities/postcard'
import type { ImageMeta } from '@cardphoto/domain/types'
import { storeAdapters } from '@db/adapters/storeAdapters'
import { hydrateSessionImageMeta, prepareForRedux } from './cardphotoHelpers'

const isDeadBlobUrl = (u: string | null | undefined): boolean =>
  typeof u === 'string' && u.startsWith('blob:')

function cardphotoPreviewFingerprint(card: Postcard['card']): string {
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
  const row = await storeAdapters.cardphotoImages.getById(id)
  return (row as ImageMeta | null) ?? null
}

/**
 * После перезагрузки в `postcards` часто остаются «мертвые» `blob:` в meta; бинарники лежат в `cardphotoImages`.
 * Подтягиваем актуальные URL из IDB (как при гидрации редактора в sessionSaga).
 */
export async function refreshPostcardsCardphotoUrls(
  postcards: Postcard[],
): Promise<Postcard[]> {
  return Promise.all(postcards.map(refreshOnePostcard))
}

async function refreshOnePostcard(p: Postcard): Promise<Postcard> {
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

  const idbMeta = await loadCardphotoImageFromIdb(applied.id)
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
    card: nextCard,
  }
}

export function postcardCardphotoNeedsPersist(
  before: Postcard,
  after: Postcard,
): boolean {
  return cardphotoPreviewFingerprint(before.card) !== cardphotoPreviewFingerprint(after.card)
}
