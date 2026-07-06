import React from 'react'
import {
  CartListPanel,
  type CartListPanelItem,
} from '@cart/presentation/CartListPanel'
import { useMobileDateListSlotActions } from './MobileDateListSlotActionsContext'

type MobileCartListSlotProps = {
  onSelectEntry?: (item: CartListPanelItem) => void
  onDateEditEntry?: (item: CartListPanelItem) => void
}

export const MobileCartListSlot: React.FC<MobileCartListSlotProps> = ({
  onSelectEntry: onSelectEntryProp,
  onDateEditEntry: onDateEditEntryProp,
}) => {
  const {
    onCartListSelectEntry,
    onCartListDateEditEntry,
  } = useMobileDateListSlotActions()

  return (
    <CartListPanel
      onSelectEntry={onSelectEntryProp ?? onCartListSelectEntry}
      onDateEditEntry={onDateEditEntryProp ?? onCartListDateEditEntry}
      hideListHeaderChrome
    />
  )
}
