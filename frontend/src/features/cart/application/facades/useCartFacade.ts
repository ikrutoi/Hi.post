import { useAppDispatch } from '@app/hooks/useAppDispatch'
import { useAppSelector } from '@app/hooks/useAppSelector'
import { cartActions } from '../state/cartSlice'
import { selectCartItems, selectCartCount } from '../state/cartSelectors'
import type { CartPostcard } from '../../domain/cartModel'

export const useCartFacade = () => {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const countCart = useAppSelector(selectCartCount)

  return {
    cartItems,
    countCart,
    setCart: (payload: CartPostcard[]) =>
      dispatch(cartActions.setCart(payload)),
    addCartItem: (item: CartPostcard) =>
      dispatch(cartActions.addCartItem(item)),
    clearCart: () => dispatch(cartActions.clearCart()),
  }
}
