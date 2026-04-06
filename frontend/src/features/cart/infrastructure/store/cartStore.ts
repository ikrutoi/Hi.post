import type { Postcard } from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'

/** Корзина в IDB: те же строки, что в `postcards`, с `card.status === 'cart'`. */
export const cartStore = {
  getAll: async (): Promise<Postcard[]> =>
    (await postcardsAdapter.getAll()).filter((p) => p.card.status === 'cart'),
  getById: async (id: IDBValidKey) => {
    const r = await postcardsAdapter.getById(id)
    return r && r.card.status === 'cart' ? r : null
  },
}
