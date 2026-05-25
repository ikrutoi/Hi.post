import type { Card } from '@entities/card/domain/types'
import { postcardRefsFromCard, type PostcardHydrated } from '@entities/postcard'
import type { ImageMeta } from '@cardphoto/domain/types'
import { hydrateSessionImageMeta, prepareForRedux } from './cardphotoHelpers'
import { loadCardphotoImageMetaFromIdb } from '@cardphoto/application/helpers/loadCardphotoImageMetaFromIdb'

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
    postcard: postcardRefsFromCard(nextCard),
    card: nextCard,
  }
}

export function postcardCardphotoNeedsPersist(
  before: PostcardHydrated,
  after: PostcardHydrated,
): boolean {
  return cardphotoPreviewFingerprint(before.card) !== cardphotoPreviewFingerprint(after.card)
}
