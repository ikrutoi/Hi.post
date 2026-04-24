import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  addItem,
  removeItem,
  updateItem,
  clearCart,
  setCartListPanelOpen,
  setCartListSelectedLocalId,
} from '../../infrastructure/state'
import {
  selectCartCount,
  selectCartListPanelOpen,
  selectCartListSelectedLocalId,
} from '../../infrastructure/selectors'
import type { Postcard } from '@entities/postcard'

export const useCartFacade = () => {
  const dispatch = useAppDispatch()

  const count = useAppSelector(selectCartCount)
  const listPanelOpen = useAppSelector(selectCartListPanelOpen)
  const listSelectedLocalId = useAppSelector(selectCartListSelectedLocalId)

  return {
    count,
    listPanelOpen,
    listSelectedLocalId,
    setCartListPanelOpen: (value: boolean) =>
      dispatch(setCartListPanelOpen(value)),
    setCartListSelectedLocalId: (value: number | null) =>
      dispatch(setCartListSelectedLocalId(value)),
    addItem: (item: Postcard) => dispatch(addItem(item)),
    removeItem: (localId: number) => dispatch(removeItem(localId)),
    updateItem: (item: Postcard) => dispatch(updateItem(item)),
    clearCart: () => dispatch(clearCart()),
  }
}
