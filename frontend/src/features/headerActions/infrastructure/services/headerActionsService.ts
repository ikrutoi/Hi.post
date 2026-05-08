import type { AppDispatch } from '@app/state'
import { postcardsAdapter } from '@db/adapters/storeAdapters'
import { setShoppingCards } from '@store/slices/layoutSlice'
import type { StatusType } from '../../domain/types'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'

export const fetchHeaderStatus = async (
  dispatch: AppDispatch
): Promise<{ status: StatusType; cartCount: number; draftsCount: number }> => {
  const stored = await postcardsAdapter.getAll()
  const now = getCurrentDate()
  const cartCount = stored.filter(
    (p) =>
      (p.status === 'cart' || p.status === 'cartBlocked') &&
      !isDispatchDateDisabledForOrder(p.date, now),
  ).length
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
