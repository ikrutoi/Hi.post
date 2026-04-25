import { cardPieFavoritesAdapter } from '@db/adapters/storeAdapters'
import type { CardPieData, CardPieRefs } from '../../domain/types'

export const buildCardPieRefsKey = (refs: CardPieRefs): string =>
  [refs.cardphoto, refs.cardtext, refs.sender, refs.recipient, refs.aroma].join('|')

const sameRefs = (a: CardPieRefs, b: CardPieRefs): boolean =>
  a.cardphoto === b.cardphoto &&
  a.cardtext === b.cardtext &&
  a.sender === b.sender &&
  a.recipient === b.recipient &&
  a.aroma === b.aroma

export async function listCardPieFavorites(): Promise<CardPieData[]> {
  return cardPieFavoritesAdapter.getAll()
}

export async function addCardPieFavorite(refs: CardPieRefs): Promise<CardPieData> {
  const all = await cardPieFavoritesAdapter.getAll()
  const existing = all.find((row) => sameRefs(row.refs, refs))
  if (existing) return existing

  const localId = (await cardPieFavoritesAdapter.getMaxLocalId()) + 1
  const record: CardPieData = { localId, refs }
  await cardPieFavoritesAdapter.putByLocalId(record)
  return record
}

export async function removeCardPieFavoriteByRefs(
  refs: CardPieRefs,
): Promise<boolean> {
  const all = await cardPieFavoritesAdapter.getAll()
  const existing = all.find((row) => sameRefs(row.refs, refs))
  if (!existing) return false
  await cardPieFavoritesAdapter.deleteById(existing.localId)
  return true
}

export async function toggleCardPieFavoriteByRefs(
  refs: CardPieRefs,
): Promise<{ isFavorite: boolean; record: CardPieData | null }> {
  const removed = await removeCardPieFavoriteByRefs(refs)
  if (removed) return { isFavorite: false, record: null }
  const created = await addCardPieFavorite(refs)
  return { isFavorite: true, record: created }
}
