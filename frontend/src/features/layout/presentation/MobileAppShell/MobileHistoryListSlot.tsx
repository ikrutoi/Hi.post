import React from 'react'
import { HistoryListRightSlot } from '@date/presentation/HistoryListRightSlot'
import type { HistoryListPanelItem } from '@date/presentation/HistoryListPanel'
import { HistoryListMobileFactoryLowerToolbar } from '@date/presentation/HistoryListMobileFactoryToolbar'
import { useMobileDateListSlotActions } from './MobileDateListSlotActionsContext'

type MobileHistoryListSlotProps = {
  onSelectEntry?: (item: HistoryListPanelItem) => void
}

export const MobileHistoryListSlot: React.FC<MobileHistoryListSlotProps> = ({
  onSelectEntry: onSelectEntryProp,
}) => {
  const { onHistoryListSelectEntry } = useMobileDateListSlotActions()

  return (
    <>
      <HistoryListMobileFactoryLowerToolbar />
      <HistoryListRightSlot
        factoryChrome
        onSelectEntry={onSelectEntryProp ?? onHistoryListSelectEntry}
      />
    </>
  )
}
