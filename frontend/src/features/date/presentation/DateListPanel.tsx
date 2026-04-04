import React from 'react'
import { IconX, IconListDate } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import {
  DateListEntry,
  type DateListEntryVariant,
} from './dateList/DateListEntry'
import type { CardStatus } from '@entities/card/domain/types'
import styles from './DateListPanel.module.scss'

export type DateListPanelItem = {
  id: string
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  variant?: DateListEntryVariant
  previewStatus?: CardStatus
}

type Props = {
  onClose: () => void
  entries?: DateListPanelItem[]
  onSelectEntry?: (id: string) => void
}

export const DateListPanel: React.FC<Props> = ({
  onClose,
  entries = [],
  onSelectEntry,
}) => {
  const hasRows = entries.length > 0

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <Toolbar section="dateList" />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close date list"
        >
          <IconX />
        </button>
      </div>
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          className={styles.list}
          tabIndex={0}
          aria-label="Dispatch date list"
        >
          {hasRows ? (
            entries.map((item) => (
              <DateListEntry
                key={item.id}
                dateLabel={item.dateLabel}
                previewUrl={item.previewUrl}
                detailLine={item.detailLine}
                variant={item.variant}
                previewStatus={item.previewStatus}
                onSelect={
                  onSelectEntry && item.variant !== 'inactive'
                    ? () => onSelectEntry(item.id)
                    : undefined
                }
              />
            ))
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              <IconListDate className={styles.listEmptyIcon} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
