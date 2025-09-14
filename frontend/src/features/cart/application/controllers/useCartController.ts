import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { cartActions } from '../state/cart.slice'
import { selectCartItems, selectCartCount } from '../selectors/cart.selector'
import type { CartPostcard } from '../../domain/types/cart.types'

export const useCartController = () => {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const cartCount = useAppSelector(selectCartCount)

  const setCart = (payload: CartPostcard[]) => {
    dispatch(cartActions.setCart(payload))
  }

  const addCartItem = (item: CartPostcard) => {
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
