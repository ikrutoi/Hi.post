import React from 'react'
import { HistoryListRightSlot } from '@date/presentation/HistoryListRightSlot'
import type { HistoryListPanelItem } from '@date/presentation/HistoryListPanel'
import styles from './MobileCartListSlot.module.scss'

type MobileHistoryListSlotProps = {
  onSelectEntry: (item: HistoryListPanelItem) => void
}

export const MobileHistoryListSlot: React.FC<MobileHistoryListSlotProps> = ({
  onSelectEntry,
}) => (
  <div className={styles.root}>
    <div className={styles.panelWrap}>
      <HistoryListRightSlot
        onSelectEntry={onSelectEntry}
        leadIconKeyOverride="date"
      />
    </div>
  </div>
)
