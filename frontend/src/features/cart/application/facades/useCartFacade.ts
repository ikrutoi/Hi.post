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
import type { PostcardHydrated } from '@entities/postcard'

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
    addItem: (item: PostcardHydrated) => dispatch(addItem(item)),
    removeItem: (localId: number) => dispatch(removeItem(localId)),
    updateItem: (item: PostcardHydrated) => dispatch(updateItem(item)),
    clearCart: () => dispatch(clearCart()),
  }
}
