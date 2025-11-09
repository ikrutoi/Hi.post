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
import type { CartItem } from '@entities/cart/domain/types'

export const useCartController = () => {
  const dispatch = useAppDispatch()

  const amount = useAppSelector(selectCartAmount)
  const count = useAppSelector(selectCartCount)

  const addCartItem = (item: CartItem) => dispatch(addItem(item))
  const removeCartItem = (localId: number) => dispatch(removeItem(localId))
  const updateCartItem = (item: CartItem) => dispatch(updateItem(item))
  const clearCartItems = () => dispatch(clearCart())

  return {
    state: {
      amount,
      count,
    },
    actions: {
      addCartItem,
      removeCartItem,
      updateCartItem,
      clearCartItems,
    },
  }
}
