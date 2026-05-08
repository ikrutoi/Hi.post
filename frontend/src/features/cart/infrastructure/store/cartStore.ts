import type { PostcardHydrated } from '@entities/postcard'
import { postcardsAdapter } from '@db/adapters/storeAdapters/postcardsAdapter'

/** Корзина в IDB: те же строки, что в `postcards`, с `status === 'cart'|'cartBlocked'`. */
export const cartStore = {
  getAll: async (): Promise<PostcardHydrated[]> =>
    (await postcardsAdapter.getAll()).filter(
      (p) => p.status === 'cart' || p.status === 'cartBlocked',
    ),
  getById: async (id: IDBValidKey) => {
    const r = await postcardsAdapter.getById(id)
    return r && (r.status === 'cart' || r.status === 'cartBlocked') ? r : null
  },
}
