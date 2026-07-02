import React from 'react'
import {
  CartListPanel,
  type CartListPanelItem,
} from '@cart/presentation/CartListPanel'
import styles from './MobileCartListSlot.module.scss'

type MobileCartListSlotProps = {
  onSelectEntry: (item: CartListPanelItem) => void
  onDateEditEntry: (item: CartListPanelItem) => void
}

export const MobileCartListSlot: React.FC<MobileCartListSlotProps> = ({
  onSelectEntry,
  onDateEditEntry,
}) => (
  <div className={styles.root}>
    <div className={styles.panelWrap}>
      <CartListPanel
        onSelectEntry={onSelectEntry}
        onDateEditEntry={onDateEditEntry}
        leadIconKeyOverride="date"
      />
    </div>
  </div>
)
