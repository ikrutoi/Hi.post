import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  addItem,
  removeItem,
  updateItem,
  clearCart,
  setCartListPanelOpen,
} from '../../infrastructure/state'
import {
  selectCartCount,
  selectCartListPanelOpen,
} from '../../infrastructure/selectors'
import type { Postcard } from '@entities/postcard'

export const useCartFacade = () => {
  const dispatch = useAppDispatch()

  const count = useAppSelector(selectCartCount)
  const listPanelOpen = useAppSelector(selectCartListPanelOpen)

  return {
    count,
    listPanelOpen,
    setCartListPanelOpen: (value: boolean) =>
      dispatch(setCartListPanelOpen(value)),
    addItem: (item: Postcard) => dispatch(addItem(item)),
    removeItem: (localId: number) => dispatch(removeItem(localId)),
    updateItem: (item: Postcard) => dispatch(updateItem(item)),
    clearCart: () => dispatch(clearCart()),
  }
}
