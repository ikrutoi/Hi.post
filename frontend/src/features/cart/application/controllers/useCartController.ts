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

export const useCartController = () => {
  const dispatch = useAppDispatch()

  const amount = useAppSelector(selectCartAmount)
  const count = useAppSelector(selectCartCount)

  const addPostcard = (item: Postcard) => dispatch(addItem(item))
  const removePostcard = (localId: number) => dispatch(removeItem(localId))
  const updatePostcard = (item: Postcard) => dispatch(updateItem(item))
  const clearCartItems = () => dispatch(clearCart())

  return {
    state: {
      amount,
      count,
    },
    actions: {
      addPostcard,
      removePostcard,
      updatePostcard,
      clearCartItems,
    },
  }
}
