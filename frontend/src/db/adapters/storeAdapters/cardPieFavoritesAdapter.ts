import { createStoreAdapter } from '../factory/createStoreAdapter'
import type { CardPieFavoriteTemplate } from '@features/cardPie/domain/types'
import { getDatabase, handleTransactionPromise } from '@db/core'

const base = createStoreAdapter<CardPieFavoriteTemplate>('cardPieFavorites')

export const cardPieFavoritesAdapter = {
  ...base,
  putByLocalId: async (record: CardPieFavoriteTemplate): Promise<void> => {
    const db = await getDatabase()
    const tx = db.transaction('cardPieFavorites', 'readwrite')
    tx.objectStore('cardPieFavorites').put(record)
    await handleTransactionPromise(tx)
  },
}
