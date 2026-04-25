import type { AppDispatch } from '@app/state'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import { setShoppingCards } from '@store/slices/layoutSlice'
import type { StatusType } from '../../domain/types'

export const fetchHeaderStatus = async (
  dispatch: AppDispatch
): Promise<{ status: StatusType; cartCount: number; draftsCount: number }> => {
  const stored = await postcardsAdapter.getAll()
  const cartCount = stored.filter((p) => p.status === 'cart').length
  const draftsCount = 0

  dispatch(setShoppingCards(Boolean(cartCount)))

  return {
    status: {
      cart: Boolean(cartCount),
      clip: false,
      clipId: '',
    },
    cartCount,
    draftsCount,
  }
}
