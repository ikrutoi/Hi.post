import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  addItem,
  removeItem,
  updateItem,
  clearCart,
} from '../../infrastructure/state'
import {
  selectCartAmount,
  selectCartCount,
} from '../../infrastructure/selectors'
import type { Postcard } from '@entities/cart/domain/types'

export const useCartFacade = () => {
  const dispatch = useAppDispatch()

  const amount = useAppSelector(selectCartAmount)
  const count = useAppSelector(selectCartCount)

  return {
    state: {
      amount,
      count,
    },
    actions: {
      addItem: (item: Postcard) => dispatch(addItem(item)),
      removeItem: (localId: number) => dispatch(removeItem(localId)),
      updateItem: (item: Postcard) => dispatch(updateItem(item)),
      clearCart: () => dispatch(clearCart()),
    },
  }
}
