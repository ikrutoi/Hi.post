import { cardPieFavoritesAdapter } from '@db/adapters/storeAdapters'
import { nanoid } from 'nanoid'
import type { CardPieFavoriteTemplate, CardPieRefs } from '../../domain/types'

const CARDPIE_FAVORITES_CHANGED_EVENT = 'cardpie-favorites-changed'

export const buildCardPieRefsKey = (refs: CardPieRefs): string =>
  [refs.cardphoto, refs.cardtext, refs.sender, refs.recipient, refs.aroma].join('|')

const sameRefs = (a: CardPieRefs, b: CardPieRefs): boolean =>
  a.cardphoto === b.cardphoto &&
  a.cardtext === b.cardtext &&
  a.sender === b.sender &&
  a.recipient === b.recipient &&
  a.aroma === b.aroma

function emitCardPieFavoritesChanged(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(CARDPIE_FAVORITES_CHANGED_EVENT))
}

export const cardPieFavoritesChangedEvent = CARDPIE_FAVORITES_CHANGED_EVENT

export async function listCardPieFavorites(): Promise<CardPieFavoriteTemplate[]> {
  const all = await cardPieFavoritesAdapter.getAll()
  // Backfill id for legacy rows created before `CardPieFavoriteTemplate.id` was introduced.
  const hydrated: CardPieFavoriteTemplate[] = []
  for (const row of all as Array<CardPieFavoriteTemplate & { id?: string }>) {
    const id = row.id && row.id.length > 0 ? row.id : nanoid()
    const next: CardPieFavoriteTemplate = {
      id,
      localId: row.localId,
      refs: row.refs,
    }
    hydrated.push(next)
    if (row.id !== id) {
      await cardPieFavoritesAdapter.putByLocalId(next)
    }
  }
  return hydrated
}

export async function addCardPieFavorite(
  refs: CardPieRefs,
): Promise<CardPieFavoriteTemplate> {
  const all = await cardPieFavoritesAdapter.getAll()
  const existing = all.find((row) => sameRefs(row.refs, refs))
  if (existing) return existing

  const localId = (await cardPieFavoritesAdapter.getMaxLocalId()) + 1
  const record: CardPieFavoriteTemplate = { id: nanoid(), localId, refs }
  await cardPieFavoritesAdapter.putByLocalId(record)
  emitCardPieFavoritesChanged()
  return record
}

export async function removeCardPieFavoriteByRefs(
  refs: CardPieRefs,
): Promise<boolean> {
  const all = await cardPieFavoritesAdapter.getAll()
  const existing = all.find((row) => sameRefs(row.refs, refs))
  if (!existing) return false
  await cardPieFavoritesAdapter.deleteById(existing.localId)
  emitCardPieFavoritesChanged()
  return true
}

export async function toggleCardPieFavoriteByRefs(
  refs: CardPieRefs,
): Promise<{ isFavorite: boolean; record: CardPieFavoriteTemplate | null }> {
  const removed = await removeCardPieFavoriteByRefs(refs)
  if (removed) return { isFavorite: false, record: null }
  const created = await addCardPieFavorite(refs)
  return { isFavorite: true, record: created }
}
