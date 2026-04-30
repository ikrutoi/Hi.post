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
import type { PostcardHydrated } from '@entities/postcard'

export const useCartController = () => {
  const dispatch = useAppDispatch()

  const amount = useAppSelector(selectCartAmount)
  const count = useAppSelector(selectCartCount)

  const addPostcard = (item: PostcardHydrated) => dispatch(addItem(item))
  const removePostcard = (localId: number) => dispatch(removeItem(localId))
  const updatePostcard = (item: PostcardHydrated) => dispatch(updateItem(item))
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
