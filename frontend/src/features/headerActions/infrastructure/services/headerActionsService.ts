import type { AppDispatch } from '@app/state'
import { cartAdapter, draftsAdapter } from '@db/adapters/storeAdapters'
import { setShoppingCards } from '@store/slices/layoutSlice'
import type { StatusType } from '../../domain/types'

export const fetchHeaderStatus = async (
  dispatch: AppDispatch
): Promise<{ status: StatusType; cartCount: number; draftsCount: number }> => {
  const cart = await cartAdapter.getAll()
  const drafts = await draftsAdapter.getAll()

  const cartCount = cart.length || 0
  const draftsCount = drafts.length || 0

  dispatch(setShoppingCards(Boolean(cartCount)))

  return {
    status: {
      cart: Boolean(cartCount),
      clip: Boolean(draftsCount),
      clipId: '',
    },
    cartCount,
    draftsCount,
  }
}
