import { useAppDispatch, useAppSelector } from '@app/hooks'
import { cartActions } from '../../infrastructure/state'
import {
  selectCartItems,
  selectCartCount,
} from '../../infrastructure/selectors'
import type { Cart, CartItem } from '../../domain/types'

export const useCartController = () => {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const cartCount = useAppSelector(selectCartCount)

  const setCart = (payload: Cart[]) => {
    dispatch(cartActions.setCart(payload))
  }

  const addCartItem = (item: CartItem) => {
    dispatch(cartActions.addCartItem(item))
  }

  const clearCart = () => {
    dispatch(cartActions.clearCart())
  }

  return {
    cartItems,
    cartCount,
    setCart,
    addCartItem,
    clearCart,
  }
}
