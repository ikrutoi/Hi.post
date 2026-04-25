import { createStoreAdapter } from '../factory/createStoreAdapter'
import type { CardPieData } from '@features/cardPie/domain/types'
import { getDatabase, handleTransactionPromise } from '@db/core'

const base = createStoreAdapter<CardPieData>('cardPieFavorites')

export const cardPieFavoritesAdapter = {
  ...base,
  putByLocalId: async (record: CardPieData): Promise<void> => {
    const db = await getDatabase()
    const tx = db.transaction('cardPieFavorites', 'readwrite')
    tx.objectStore('cardPieFavorites').put(record)
    await handleTransactionPromise(tx)
  },
}
